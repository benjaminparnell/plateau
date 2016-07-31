const assert = require('assert')
const rewire = require('rewire')
var createKeyGenerator = rewire('../lib/key-generator')

let dbMock = (db) => {
  return {
    get (id, cb) {
      if (db[id]) {
        cb(null, db[id])
      } else {
        cb(new Error('Key not found'))
      }
    }
  }
}

describe('#keyGenerator', () => {
  it('should generate a key', (done) => {
    let db = {}
    let keyGenerator = createKeyGenerator(dbMock(db))
    keyGenerator((key) => {
      assert.equal(typeof key, 'string')
      done()
    })
  })

  it('should call itself again if a key clash occurs', (done) => {
    let db = { 'abc': 'http://google.com' }
    let generateCalled = 0
    let revert = createKeyGenerator.__set__('shortid', {
      generate () {
        generateCalled++
        if (generateCalled === 1) {
          return 'abc'
        } else {
          return 'def'
        }
      }
    })
    let keyGenerator = createKeyGenerator(dbMock(db))
    keyGenerator((key) => {
      revert()
      assert.equal(generateCalled, 2)
      done()
    })
  })
})
