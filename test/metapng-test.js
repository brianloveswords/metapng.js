var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs'),
    metapng = require('../index.js'),
    path = require('path');

var testfile = path.join(__dirname, './pngs/test.png');
vows.describe('metapng').addBatch({
  'Should be able to read': { 
    topic: function(){ return metapng.read },
    'by filename': function(reader){
      var filename = testfile;
      assert.isArray(reader(filename));
    },
    'by file descriptor': function(reader){
      var fd = fs.openSync(testfile, 'r');
      assert.isArray(reader(fd));
    },
    'by buffer': function(reader){
      var buffer = fs.readFileSync(testfile);
      assert.isArray(reader(buffer));
    },
  },
  'Should be able to write': { 
    topic: function(){
      return metapng.write(testfile, 'omg', 'ponies');
    },
    'and get a new buffer back': function(buf){
      assert.ok(Buffer.isBuffer(buf));
    },
    'and get back written keyword': function(buf){
      assert.equal(metapng.read(buf, 'omg').pop(), 'ponies');
    },
    'and not get non-existant keyword': function(buf){
      assert.equal(metapng.read(buf, 'nevaaar').length, 0);
    },
    'and throw error on unique-write of same keyword': function(buf){
      assert.throws(function(){
        metapng.writeOne(buf, 'omg', 'ponies');
      }, Error);
    },
    'and do unique-write of different keyword': function(buf){
      var newbuf;
      assert.doesNotThrow(function(){
        newbuf = metapng.writeOne(buf, 'omgzlls', 'horses');
      }, Error);
      assert.equal(metapng.read(newbuf, 'omgzlls').pop(), 'horses');
    },
  }
}).export(module);