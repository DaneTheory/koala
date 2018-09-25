#!/usr/bin/env node
const { resolve } = require('path')
const { _: args } = require('minimist')(process.argv.slice(2))
const shortid = require('shortid')

const [ path = '' ] = args
const fullpath = resolve(process.cwd(), path)

console.log(fullpath)
