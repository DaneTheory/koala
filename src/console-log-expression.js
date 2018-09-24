const { resolve } = require('path')
const file = ({ file }) => file.opts

const commentEnd = ({ trailingComments = [] }) => trailingComments
  .map(({ end }) => end)

module.exports = (t, path, state, input) => {
  const { line, column } = path.node.loc.end
  const { filename } = file(state)
  const filepath = resolve(process.cwd(), filename)

  const [ endPos ] = commentEnd(path.node)

  return t.logicalExpression(
    '&&',
    t.memberExpression(
      t.memberExpression(
        t.identifier('process'),
        t.identifier('env')
      ),
      t.identifier('KOALA')
    ),
    t.callExpression(
      t.memberExpression(
        t.identifier('console'),
        t.identifier('log')
      ),
      [
        t.stringLiteral(''),
        input,
        t.stringLiteral(` 🐨 at ${filepath}:${line}:${column}:${endPos}`)
      ]
    )
  )
}
