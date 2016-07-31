let shortid = require('shortid')

function createKeyGenerator (db) {
  return function generateKey (cb) {
    let key = shortid.generate()
    db.get(key, (err) => {
      if (err) return cb(key)
      generateKey(cb)
    })
  }
}

module.exports = createKeyGenerator
