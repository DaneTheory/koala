const { parse } = require('@babel/parser')
const KOALA_SYMBOL = '?'

const hasKoalaComment = it => it && it.some(koalaComment)
const koalaComment = ({ value: s }) => s.trim().startsWith(KOALA_SYMBOL)
const koalaExpression = ({ value: s }) => s.trim().slice(1)
const evalExpression = ({ trailingComments }) => trailingComments
  .filter(koalaComment)
  .map(koalaExpression)
  .filter(i => i)
  .map(parse)

module.exports = { hasKoalaComment, evalExpression }
