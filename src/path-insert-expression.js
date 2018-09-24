const { parse } = require('@babel/parser')
const get = require('./utils/path')

const KOALA_SYMBOL = '?'

const hasKoalaComment = it => it && it.some(koalaComment)
const koalaComment = ({ value: s }) => s.trim().startsWith(KOALA_SYMBOL)
const koalaExpression = ({ value: s }) => s.trim().slice(1)
const evalExpression = ({ trailingComments }) => trailingComments
  .filter(koalaComment)
  .map(koalaExpression)
  .filter(i => i)
  .map(parse)

module.exports = (types, path, state) => (logF, codeF, varF) => {
  if (!hasKoalaComment(get(['node', 'trailingComments'], path))) return
  const [ koalaCode ] = evalExpression(path.node)

  path.insertAfter(
    logF(
      koalaCode
        ? codeF(koalaCode)
        : varF(path)
    )
  )
}
