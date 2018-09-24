const get = require('./utils/path')
const consoleLogExpression = require('./console-log-expression')
const applyPathInsertion = require('./path-insert-expression')

module.exports = ({ types: t }) => ({
  name: 'babel-plugin-koala',
  visitor: {
    VariableDeclaration (path, state) {
      applyPathInsertion
        .call({}, t, path, state)
        .call({},
          consoleLogExpression.bind({}, t, path, state),
          get.bind({}, ['program', 'body', '0', 'expression']),
          get.bind({}, ['node', 'declarations', '0', 'node'])
        )
    },

    ExpressionStatement (path, state) {
      applyPathInsertion
        .call({}, t, path, state)
        .call({},
          consoleLogExpression.bind({}, t, path, state),
          get.bind({}, ['program', 'body', '0', 'expression']),
          get.bind({}, ['node', 'expression'])
        )
    }
  }
})
