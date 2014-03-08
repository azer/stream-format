var through = require("through");
var concat = require("concat-stream");
var render = require("new-format");
var iterate = require('iter').parallel;

module.exports = format;

function format (vars) {
  var stream = through(write).pause();
  var content;
  var keys;

    if (arguments.length == 1 && typeof vars == 'object') {
    keys = Object.keys(vars);
    content = {};
  } else {
    vars = Array.prototype.slice.call(arguments);
    content = [];
  }

  iterate((keys || vars).length)
    .done(function () {
      stream.resume();
    })
    .error(function (error) {
      stream.emit('error', error);
    })
    .run(each);

  return stream;

  function each (ok, index) {
    var key;
    var value;

    if (keys) {
      key = keys[index];
      value = vars[key];
    } else {
      key = index;
      value = vars[index];
    }

    if (!value || !value.pipe) {
      content[key] = value;
      return ok();
    }

    value.on('error', ok).pipe(concat(function (data) {
      content[key] = data.toString();
      ok();
    }));
  }

  function write (template) {
    this.queue(render(template, content));
  }

}
