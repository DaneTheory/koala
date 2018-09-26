#!/usr/bin/env node
const { resolve, dirname, basename } = require('path')
const args = require('minimist')(process.argv.slice(2))
const { createMonitor } = require('watch')
const shortid = require('shortid')

const [ path = '' ] = args._

const errorAndQuit = (...msg) => {
  console.error(...msg)
  process.exit(0)
}

const loadConfig = (conf) => {
  const cwd = process.cwd()
  const configPath = resolve(cwd, conf)
  try {
    return require(configPath)
  } catch (e) {
    errorAndQuit('Cannot find config file', configPath)
  }
}

const cwd = process.cwd()
// const config = loadConfig(args['config'] || args['c'])
const watchDir = resolve(cwd, path)
const outDir = resolve(cwd, args['out-dir'] || args['o'])

createMonitor(watchDir, { interval: 0.2 }, monitor => {
  monitor.on('changed', f => {
    const file = basename(f, '.js')
    const outFile = f
      .replace(watchDir, outDir)
      .replace(file, shortid())

    const command = `npx babel ${f} --out-file ${outFile} --plugins='babel-plugin-koala'`

    console.log(command)
  })
})
