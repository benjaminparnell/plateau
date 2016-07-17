require('dotenv').config({ silent: true })

const fs = require('fs')
const express = require('express')
const AWS = require('aws-sdk')
const shortid = require('shortid')
const levelup = require('level')
const bytes = require('bytes')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'plateau' })
const db = levelup('/var/data/plateau/db')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const API_KEY = process.env.API_KEY
const AWS_BUCKET = process.env.AWS_BUCKET

AWS.config.region = process.env.AWS_DEFAULT_REGION

const app = express()
const port = process.env.PORT || 9001

function checkApiKey (req, res, next) {
  if (req.body && req.body.apiKey && req.body.apiKey === API_KEY) {
    return next()
  } else {
    res.sendStatus(403)
  }
}

function generateKey (cb) {
  let key = shortid.generate()
  db.get(key, (err) => {
    if (err) return cb(key)
    generateKey(cb)
  })
}

app.post('/', upload.single('file'), checkApiKey, (req, res, next) => {
  log.info(`Uploading image with size ${bytes(req.file.size)}`)

  let body = fs.createReadStream(req.file.path)

  generateKey((key) => {
    let s3obj = new AWS.S3({ params: { Bucket: AWS_BUCKET, Key: key } })

    s3obj.upload({ Body: body }).send((err, data) => {
      if (err) return next(err)
      fs.unlinkSync(req.file.path)
      db.put(key, data.Location, (err) => {
        if (err) return next(err)
        let url = `${req.protocol}://${req.hostname}/${key}`
        res.status(201).send(url)
      })
    })
  })
})

app.get('/:id', (req, res, next) => {
  let id = req.params.id

  db.get(id, (err, value) => {
    if (err) {
      log.error(err.message)
      res.sendStatus(404)
    } else {
      let s3 = new AWS.S3()
      let params = { Bucket: AWS_BUCKET, Key: id }
      res.set('Content-Type', 'image/png')
      s3.getObject(params)
        .on('httpData', (chunk) => res.write(chunk))
        .on('httpDone', () => res.end())
        .send()
    }
  })
})

app.listen(port, () => {
  log.info(`plateau listening on port ${port}`)
})
