## stream-format

String formatting with streams. It's based on [new-format](http://github.com/azer/new-format)

## Install

```bash
$ npm install stream-format
```

## Usage

```js
var format = require('stream-format')
var fs = require('fs')

var index = fs.createReadStream('./index.html') // => hello world. foo: {foo}, bar: {bar}, qux: {qux}
var foo = fs.createReadStream('./foo.html') // => foo
var bar = fs.createReadStream('./bar.html') // => bar
var render = format({ foo: foo, bar: bar, qux: 'qux' });

index.pipe(render).pipe(process.stdout)
// => hello world. foo: "foo", bar: "bar", qux: "qux"
```


