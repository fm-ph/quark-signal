# quark-signal

[![build status][travis-image]][travis-url]
[![stability][stability-image]][stability-url]
[![npm version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

Simple and tiny [__Observer__](https://en.wikipedia.org/wiki/Observer_pattern) design pattern implementation written in __ES6__.

___This package is part of `quark` framework but it can be used independently.___

## Installation

[![NPM](https://nodei.co/npm/quark-signal.png)](https://www.npmjs.com/package/quark-signal)

```sh
npm install quark-signal --save
```

## Usage

### Basic

Basic example using `add()` and `dispatch()` methods.

```js
import Signal from 'quark-signal'

const mySignal = new Signal()

mySignal.add(data => { console.log(data) })
mySignal.dispatch('foo')
```

### Add once

Add a signal listener that will be called only once.

```js
import Signal from 'quark-signal'

const mySignal = new Signal()

mySignal.once(data => { console.log(data) })
mySignal.dispatch('foo')

// It will not be dispatched again
mySignal.dispatch('foo')
```

### Priority

Priorise a listener so that it will be called first when a signal is dispatched.
Higher priority listener will be called earlier.

```js
import Signal from 'quark-signal'

const mySignal = new Signal()

mySignal.add(data => { console.log(data) })
mySignal.add(data => { console.log(data) }, { priority: 1 }) // It will be called first

mySignal.dispatch('foo')
```

### Context

Bind a signal listener with a specific context.

```js
import Signal from 'quark-signal'

const obj = {
  foo: 'bar'
}

function callback () {
  console.log(this.foo) // = 'bar'
}

const mySignal = new Signal()

mySignal.add(callback, { context: obj })
mySignal.dispatch()
```

### Remove

Remove a signal listener.

```js
import Signal from 'quark-signal'

const mySignal = new Signal()

const listener = data => { console.log(data) }

mySignal.add(listener)
mySignal.dispatch('foo')
mySignal.remove(listener)
```

Remove all signal listeners.

```js
import Signal from 'quark-signal'

const mySignal = new Signal()

const listener = data => { console.log(data) }

mySignal.add(listener)
mySignal.add(listener)
mySignal.removeAll()
```

## API

See [https://fm-ph.github.io/quark-signal/](https://fm-ph.github.io/quark-signal/)

## Testing

To run the `quark-signal` tests, first clone the repository and install its dependencies :

```sh
git clone https://github.com/fm_ph/quark-signal.git
cd quark-signal
npm install
```

Then, run the tests with :

```sh
npm test
```

For coverage, use :

```sh
npm test:coverage
```

## References

- [https://github.com/edankwan/min-signal](https://github.com/edankwan/min-signal)
- [https://github.com/millermedeiros/js-signals](https://github.com/millermedeiros/js-signals)
- [https://github.com/robertpenner/as3-signals](https://github.com/robertpenner/as3-signals)

## License

MIT License © [Patrick Heng](http://hengpatrick.fr/) [Fabien Motte](http://fabienmotte.com/) 

[travis-image]: https://img.shields.io/travis/fm-ph/quark-signal/master.svg?style=flat-square
[travis-url]: http://travis-ci.org/fm-ph/quark-signal
[stability-image]: https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/quark-signal.svg?style=flat-square
[npm-url]: https://npmjs.org/package/quark-signal
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
