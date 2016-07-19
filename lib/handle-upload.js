const fs = require('fs')
const bytes = require('bytes')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const createKeyGenerator = require('./key-generator')

function checkApiKey (req, res, next) {
  if (req.get('X-API-KEY') === process.env.API_KEY) {
    return next()
  } else {
    res.sendStatus(403)
  }
}

function createUploadHandler (app, db, log, AWS) {
  const generateKey = createKeyGenerator(db)

  app.post('/', upload.single('file'), checkApiKey, (req, res, next) => {
    log.info(`Uploading image with size ${bytes(req.file.size)}`)

    let body = fs.createReadStream(req.file.path)

    generateKey((key) => {
      let s3obj = new AWS.S3({ params: {
        Bucket: process.env.AWS_BUCKET,
        Key: key }
      })

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
}

module.exports = createUploadHandler
