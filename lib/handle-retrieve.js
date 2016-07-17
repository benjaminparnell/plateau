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
          Key: id }
        res.set('Content-Type', 'image/png')
        s3.getObject(params)
          .on('httpData', (chunk) => res.write(chunk))
          .on('httpDone', () => res.end())
          .send()
      }
    })
  })
}

module.exports = createRetrieveHandler
