require('dotenv').config({ silent: true })

const express = require('express')
const levelup = require('level')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'plateau' })
const db = levelup(process.env.LEVELDB_PATH)
const AWS = require('aws-sdk')

AWS.config.region = process.env.AWS_DEFAULT_REGION

const app = express()
const port = process.env.PORT || 9001

const createUploadHandler = require('./lib/handle-upload')
const createRetrieveHandler = require('./lib/handle-retrieve')

createUploadHandler(app, db, log, AWS)
createRetrieveHandler(app, db, log, AWS)

app.listen(port, () => {
  log.info(`plateau listening on port ${port}`)
})
