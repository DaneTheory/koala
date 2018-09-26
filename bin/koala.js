#!/usr/bin/env node
const { exec } = require('child_process')
const { resolve, dirname, basename } = require('path')
const { createMonitor } = require('watch')
const logUpdate = require('log-update')
const args = require('minimist')(process.argv.slice(2))
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

const executeFile = f => {
  const file = basename(f, '.js')
  const outFile = f
        .replace(watchDir, outDir)
        .replace(file, shortid())

  const build = `npx babel ${f} --out-file ${outFile} --plugins='babel-plugin-koala'`
  const run = `KOALA=true node ${outFile} | grep 🐨`
  const clean = `rm ${outFile}`

  exec(build, (err, stdout) => {
    if (err) errorAndQuit(err)
    exec(run, (err, stdout) => {
      logUpdate(stdout)
      exec(clean)
    })
  })

}

createMonitor(watchDir, { interval: 0.2 }, monitor => {
  console.log('🐨 is now running!')
  monitor.on('changed', executeFile)
  monitor.on('created', executeFile)
})
