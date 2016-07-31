const fileType = require('file-type')

function createRetrieveHandler (app, db, log, AWS) {
  app.get('/:id', (req, res, next) => {
    let id = req.params.id

    db.get(id, (err, value) => {
      if (err) {
        log.error(err.message)
        res.sendStatus(404)
      } else {
        let s3 = new AWS.S3()
        let params = {
          Bucket: process.env.AWS_BUCKET,
          Key: id
        }
        s3.getObject(params, (err, data) => {
          if (err) return next(err)
          res.set('Content-Type', fileType(data.Body).mime)
          res.write(data.Body)
          res.end()
        })
      }
    })
  })
}

module.exports = createRetrieveHandler
