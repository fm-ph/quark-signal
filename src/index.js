/**
 * Signal class
 *
 * @class
 *
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 *
 * @author Patrick Heng <hengpatrick.pro@gmail.com>
 * @author Fabien Motte <contact@fabienmotte.com>
 *
 * @example
 * const mySignal = new Signal()
 *
 * mySignal.add(bar => { console.log(bar) })
 * mySignal.dispatch('foo')
 */
class Signal {
  /**
   * Creates an instance of Signal
   *
   * @constructor
   */
  constructor () {
    this.listeners = []
  }

  /**
   * Add a listener
   *
   * @param {listenerCallback} cb Callback
   * @param {Object} [options] Options
   * @param {string} [options.priority=0] Higher priority listener will be called earlier
   * @param {string} [options.once=false] Listener called once
   * @param {any} [options.context=this] Bind the listener with a specific context
   *
   * @throws {TypeError} First argument must be a Function
   * @throws {Error} Listener already exists
   *
   * @returns {this}
   */
  add (cb, options = { priority: 0, once: false, context: this }) {
    if (typeof cb !== 'function') {
      throw new TypeError('QuarkSignal.add() : First argument must be a Function')
    }

    if (this._getListernerIndex(cb) !== -1) {
      throw new Error('QuarkSignal.add() : Listener already exists')
    }

    const listener = {
      context: this, // If options object is defined but no context precised
      ...options,
      function: cb
    }

    this.listeners.push(listener)

    // Sort listeners function by priority
    this.listeners.sort((a, b) => a.priority < b.priority)

    return this
  }

  /**
   * Add a listener once
   *
   * @param {listenerCallback} cb Callback
   * @param {Object} [options] Options
   * @param {string} [options.priority=0] Higher priority listener will be called earlier
   * @param {any} [options.context=this] Bind the listener with a specific context
   *
   * @returns {this}
   */
  once (cb, options = {}) {
    return this.add(cb, {
      ...options,
      once: true
    })
  }

  /**
   * Remove a listener
   *
   * @param {listenerCallback} cb Callback
   *
   * @returns {this}
   *
   * @throws {TypeError} First argument must be a Function
   * @throws {Error} Listener does not exist
   */
  remove (cb) {
    if (typeof cb !== 'function') {
      throw new TypeError('QuarkSignal.remove() : First argument must be a Function')
    }

    const listenerId = this._getListernerIndex(cb)

    if (listenerId === -1) {
      throw new Error('QuarkSignal.remove() : Listener does not exist')
    }

    this.listeners.splice(listenerId)

    return this
  }

  /**
   * Remove all listeners
   *
   * @returns {this}
   */
  removeAll () {
    this.listeners = []

    return this
  }

  /**
   * Dispatch a signal
   *
   * @param {...any} [args] Arguments to dispatch
   *
   * @returns {this}
   */
  dispatch (...args) {
    for (let i = 0, listenersLength = this.listeners.length; i < listenersLength; i++) {
      const listener = this.listeners[i]

      if (listener.once) {
        this.listeners.splice(i)
      }

      listener.function.call(listener.context, ...args)
    }

    return this
  }

  /**
   * Get the number of listeners
   *
   * @returns {number} Listeners number
   */
  getListenersNb () {
    return this.listeners.length
  }

  /**
   * Get listener index
   *
   * @private
   *
   * @param {listenerCallback} cb
   *
   * @returns {number} Listener index, default to -1 if the listener is not found
   */
  _getListernerIndex (cb) {
    for (let i = 0, listenersLength = this.listeners.length; i < listenersLength; i++) {
      if (this.listeners[i].function === cb) {
        return i
      }
    }

    return -1
  }
}

/**
 * Callback called when a signal is dispatched
 *
 * @callback Signal~listenerCallback
 *
 * @param {...args} args Arguments dispatched
 */

export default Signal
