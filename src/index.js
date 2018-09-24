const { parse } = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')

const consoleLogExpression = require('./console-log-expression')

const KOALA_SYMBOL = '?'
const hasKoalaComment = it => it && it.some(koalaComment)
const koalaComment = ({ value: s }) => s.trim().startsWith(KOALA_SYMBOL)
const koalaExpression = ({ value: s }) => s.trim().slice(1)
const evalExpression = ({ trailingComments }) => trailingComments
      .filter(koalaComment)
      .map(koalaExpression)
      .filter(i => i)
      .map(parse)

module.exports = ({ types: t }) => ({
  name: 'babel-plugin-koala',
  visitor: {
    VariableDeclaration (path, state) {
      if (!hasKoalaComment(path.node.trailingComments)) return
      const [ koalaCode ] = evalExpression(path.node)

      path.insertAfter(
        consoleLogExpression(
          t, path, state,
          koalaCode
            ? koalaCode.program.body[0].expression
            : path.node.declarations[0].id
        )
      )
    },

    ExpressionStatement (path, state) {
      if (!hasKoalaComment(path.node.trailingComments)) return
      const [ koalaCode ] = evalExpression(path.node)

      path.insertAfter(
        consoleLogExpression(
          t, path, state,
          koalaCode
            ? koalaCode.program.body[0].expression
            : path.node.expression
        )
      )
    }
  }
})
