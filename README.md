## stream-format

String formatting with streams. It's based on [new-format](http://github.com/azer/new-format)

## Install

```bash
$ npm install stream-format
```

## Usage

```js
format = require('stream-format')

format('Hello, {0} {1}', 'span', 'eggs').pipe(process.stdout)
// => 'Hello span eggs'

format('Hello {name} {surname}', { name: 'Azer', surname: 'Koculu' }).pipe(process.stdout)
// => 'Hello Azer Koculu'

format('Hello {name}, choose your favorite fruit: {fruits}', { fruits: fs.createReadStream('fruits.txt'), name: 'azer' })
  .pipe(process.stdout)
// => Hello azer, choose your favorite fruit: apple, orange, cherry, plums
```

See `test.js` for more info.
