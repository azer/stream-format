var format = require("./");
var concat = require("concat-stream");
var fs = require("fs");
var through = require("through");

it('renders given string with given variables and readable streams', function(done){
  var f = format({
    name: 'azer',
    npmignore: read('./.npmignore'),
    gitignore: read('./.gitignore')
  });

  through().pause().queue('hi {name}!\n\nthis is my npmignore file: {npmignore}\n\nand this is gitignore: {gitignore}').end().pipe(f);

  f.pipe(concat(function (data) {
    expect(data).to.equal(expected);
    done();
  }));
});

it('passes values as parameters', function(done){
  var f = format('azer', read('./.npmignore'), read('./.gitignore'));

  f.pipe(concat(function (data) {
    expect(data).to.equal(expected);
    done();
  }));

  through().pause().queue('hi {0}!\n\nthis is my npmignore file: {1}\n\nand this is gitignore: {2}').end().pipe(f);
});

it('renders template piece by piece', function(done){
  var f = format({
    name: 'azer',
    npmignore: read('./.npmignore'),
    gitignore: read('./.gitignore')
  });

  var ts = through();
  ts.pipe(f);

  process.nextTick(function () {
    ts.queue('hi {name}!\n\n');
    ts.queue('this is my npmignore file: {npmignore}\n\n');
    ts.queue('and this is gitignore: {gitignore}');
    ts.end();
  });

  f.pipe(concat(function (data) {
    expect(data).to.equal(expected);
    done();
  }));
});

it('fails on errors', function(done){
  format(fs.createReadStream('nonexisting'), fs.createReadStream('./.npmignore'))
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
