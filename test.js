var format = require("./");
var concat = require("concat-stream");
var fs = require("fs");
var through = require("through");
var from = require("from");

it('renders given string with given variables and readable streams', function(done){
  var f = format({
    name: 'azer',
    npmignore: read('./.npmignore'),
    gitignore: read('./.gitignore')
  });

  text('hi {name}!\n\nthis is my npmignore file: {npmignore}\n\nand this is gitignore: {gitignore}').pipe(f);

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

  text('hi {0}!\n\nthis is my npmignore file: {1}\n\nand this is gitignore: {2}').pipe(f);
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

it('can nest other format streams', function(done) {
  var qux = format({
    span: text('this is span')
  });

  var foo = format({
    qux: qux
  });

  var bar = format({
    corge: text('this is corge')
  });

  var all = format({
    foo: foo,
    bar: bar
  });

  text('this is qux. span: {span}').pipe(qux);
  text('this is bar. corge: {corge}').pipe(bar);
  text('this is foo. qux: {qux}').pipe(foo);
  text('this is all\n\nfoo: {foo}\nbar: {bar}').pipe(all);

  var expected = ['this is all\n',
                  'foo: this is foo. qux: this is qux. span: this is span',
                  'bar: this is bar. corge: this is corge'].join('\n');

  all.pipe(concat(function (data) {
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

function text () {
  var data = Array.prototype.slice.call(arguments);
  return from(data);
}
