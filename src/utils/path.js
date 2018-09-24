module.exports = (args, o) => args.reduce((acc, it) => acc ? acc[it] || undefined : acc, o)
