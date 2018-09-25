const { hasKoalaComment, evalExpression } = require('./utils/comment-parsing')
const get = require('./utils/path')

module.exports = (types, path, state) => (insertF, logF, codeF, varF) => {
  if (!hasKoalaComment(get(['node', 'trailingComments'], path))) return
  const [ koalaCode ] = evalExpression(path.node)

  insertF(
    logF(
      koalaCode
        ? codeF(koalaCode)
        : varF(path)
    )
  )
}
