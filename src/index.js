const get = require('./utils/path')
const consoleLogExpression = require('./console-log-expression')
const applyPathInsertion = require('./path-insert-expression')

const { hasKoalaComment, evalExpression } = require('./utils/comment-parsing')

const FunctionVisitor = ({
  ReturnStatement (path) {
    if (!hasKoalaComment(get(['node', 'trailingComments'], path))) return
    const [ koalaCode ] = evalExpression(path.node)
    const logExpression = consoleLogExpression(
      this.t, path, this.state,
      koalaCode
        ? get(['program', 'body', '0', 'expression'], koalaCode)
        : get(['node', 'argument'], koalaCode)
    )

    this.self.additions = [ ...this.self.additions, logExpression ]
  }
})

module.exports = ({ types: t }) => ({
  name: 'babel-plugin-koala',
  visitor: {
    VariableDeclaration (path, state) {
      applyPathInsertion
        .call({}, t, path, state)
        .call({},
          path.insertAfter.bind(path),
          consoleLogExpression.bind({}, t, path, state),
          get.bind({}, ['program', 'body', '0', 'expression']),
          get.bind({}, ['node', 'declarations', '0', 'id'])
        )
    }

    ,ExpressionStatement (path, state) {
      applyPathInsertion
        .call({}, t, path, state)
        .call({},
          path.insertAfter.bind(path),
          consoleLogExpression.bind({}, t, path, state),
          get.bind({}, ['program', 'body', '0', 'expression']),
          get.bind({}, ['node', 'expression'])
        )
    }

    ,ArrowFunctionExpression: {
      enter (path, state) {
        this.additions = []
        path.traverse(FunctionVisitor, { self: this, t, state })
      }

      ,exit (path, state) {
        path.parentPath.parentPath.insertAfter(this.additions[0])
      }
    }
  }
})

