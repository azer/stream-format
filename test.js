var format = require("./");
var concat = require("concat-stream");
var fs = require("fs");

it('renders given string with given variables and readable streams', function(done){
  format('hi {name}!\n\nthis is my npmignore file: {npmignore}\n\nand this is gitignore: {gitignore}', {
    name: 'azer',
    npmignore: read('./.npmignore'),
    gitignore: read('./.gitignore')
  }).pipe(concat(function (data) {
    expect(data).to.equal(expected);
    done();
  }));
});

it('passes values as parameters', function(done){
  var template = 'hi {0}!\n\nthis is my npmignore file: {1}\n\nand this is gitignore: {2}';
  format(template, 'azer', read('./.npmignore'), read('./.gitignore'))
    .pipe(concat(function (data) {
      expect(data).to.equal(expected);
      done();
    }));
});

it('fails on errors', function(done){
  format('foo {0} npmignore: {1}', fs.createReadStream('nonexisting'), fs.createReadStream('./.npmignore'))
    .on('error', function (error) {
      expect(error).to.exist;
      done();
    })
    .pipe(concat(function (data) {
      done(new Error('should have been failed'));
    }));
});

var expected = 'hi azer!\n\nthis is my npmignore file: '
      + cat('./.npmignore')
      + '\n\nand this is gitignore: '
      + cat('./.gitignore');

function read (path) {
  return fs.createReadStream(path);
}

function cat (path) {
  return fs.readFileSync(path).toString();
}
