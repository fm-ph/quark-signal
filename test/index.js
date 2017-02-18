import test from 'ava'

import Signal from '../src/index'
import fixtureData from './fixtures/data'

test.beforeEach(t => {
  t.context.signal = new Signal()
})

test('create a signal with one listener', t => {
  t.context.signal.add(() => { })

  t.is(t.context.signal.getListenersNb(), 1)
})

test('create a signal with an invalid listener type', t => {
  const error = t.throws(() => t.context.signal.add(null), TypeError)

  t.is(error.message, 'Signal.add() : First argument must be a Function')
})

test('create a signal with a listener that already exists', t => {
  const listener = () => { }
  t.context.signal.add(listener)

  const error = t.throws(() => t.context.signal.add(listener), Error)

  t.is(error.message, 'Signal.add() : Listener already exists')
})

test('create a signal with mutilple listeners', t => {
  t.context.signal.add(() => { })
  t.context.signal.add(() => { })

  t.is(t.context.signal.getListenersNb(), 2)
})

test.cb('create a signal and dispatch it', t => {
  t.context.signal.add(() => {
    t.pass()
    t.end()
  })

  t.context.signal.dispatch()
})

test.cb('create a signal and dispatch it with data', t => {
  t.context.signal.add(data => {
    t.deepEqual(data, fixtureData)
    t.end()
  })

  t.context.signal.dispatch(fixtureData)
})

test.cb('create a signal and dispatch it with multiple arguments', t => {
  t.context.signal.add((data1, data2) => {
    t.deepEqual(data1, fixtureData)
    t.deepEqual(data2, fixtureData)
    t.end()
  })

  t.context.signal.dispatch(fixtureData, fixtureData)
})

test('create a signal with different listeners priority', t => {
  const listener1 = () => { }
  const listener2 = () => { }

  t.context.signal.add(listener1, { priority: 1 })
  t.context.signal.add(listener2, { priority: 2 })

  t.deepEqual(t.context.signal._listeners, [
    {
      context: t.context.signal,
      function: listener2,
      priority: 2
    },
    {
      context: t.context.signal,
      function: listener1,
      priority: 1
    }
  ])
})

test('create a signal with same listeners priority', t => {
  const listener1 = () => { }
  const listener2 = () => { }

  t.context.signal.add(listener1)
  t.context.signal.add(listener2)

  t.deepEqual(t.context.signal._listeners, [
    {
      context: t.context.signal,
      function: listener1,
      priority: 0,
      once: false
    },
    {
      context: t.context.signal,
      function: listener2,
      priority: 0,
      once: false
    }
  ])
})

test('create a signal with a once listener', t => {
  t.context.signal.once(() => { })

  t.is(t.context.signal.getListenersNb(), 1)
  t.context.signal.dispatch()

  t.is(t.context.signal.getListenersNb(), 0)
  t.context.signal.dispatch()
})

test('create a signal and remove a listener', t => {
  const listener = () => { }
  t.context.signal.add(listener)

  t.context.signal.remove(listener)

  t.is(t.context.signal.getListenersNb(), 0)
})

test('create a signal and remove a listener with an invalid type', t => {
  const error = t.throws(() => t.context.signal.remove(null), TypeError)

  t.is(error.message, 'Signal.remove() : First argument must be a Function')
})

test('create a signal and remove a listener not added', t => {
  const listenerNotAdded = () => { }

  const error = t.throws(() => t.context.signal.remove(listenerNotAdded), Error)

  t.is(error.message, 'Signal.remove() : Listener does not exist')
})

test('create a signal and remove all listeners', t => {
  t.context.signal.add(() => { })
  t.context.signal.add(() => { })

  t.is(t.context.signal.getListenersNb(), 2)

  t.context.signal.removeAll()

  t.is(t.context.signal.getListenersNb(), 0)
})

test.cb('create a signal and use a custom listener context', t => {
  const obj = {
    foo: 'bar'
  }

  function listener () {
    t.is(this.foo, 'bar')
    t.end()
  }

  t.context.signal.add(listener, { context: obj })

  t.context.signal.dispatch()
})

test('create a signal that dispatch itself', t => {
  t.context.signal.add(() => {
    t.context.signal.dispatch()
  })

  const error = t.throws(() => t.context.signal.dispatch(), Error)

  t.is(error.message, 'Signal.dispatch() : Maximum dispatch limit reached (prevent infinite loop)')
})

test('create a signal with a listener that stop the propagation', t => {
  t.context.signal.add(() => false)
  t.context.signal.add(() => { })

  t.context.signal.dispatch()

  t.is(t.context.signal.getDispatchNb(), 1)
})

test('create a signal with a listener and check if it exists', t => {
  const listener = () => { }

  t.context.signal.add(listener)
  const result = t.context.signal.has(listener)

  t.true(result)
})

test('create a signal with a listener not added and check if it exists', t => {
  const listener = () => { }

  const result = t.context.signal.has(listener)

  t.falsy(result)
})
