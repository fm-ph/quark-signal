/**
 * @constant
 * @type number
 * @default
 */
const MAX_DISPATCH_NB = 512

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
    /**
     * @type array
     * @private
     */
    this._listeners = []

   /**
     * @type number
     * @private
     */
    this._dispatchNb = 0
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
    const listener = {
      context: this, // If options object is defined but no context precised
      ...options,
      function: cb
    }

    if (typeof listener.function !== 'function') {
      throw new TypeError('Signal.add() : First argument must be a Function')
    }

    if (this._getListernerIndex(listener.function, listener.context) !== -1) {
      throw new Error('Signal.add() : Listener already exists')
    }

    this._listeners.push(listener)

    // Sort listeners function by priority
    this._listeners.sort((a, b) => a.priority < b.priority)

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
   * @param {any} [context=this] Context specified when the listener was added
   *
   * @returns {this}
   *
   * @throws {TypeError} First argument must be a Function
   * @throws {Error} Listener does not exist
   */
  remove (cb, context = this) {
    if (typeof cb !== 'function') {
      throw new TypeError('Signal.remove() : First argument must be a Function')
    }

    const listenerId = this._getListernerIndex(cb, context)

    if (listenerId === -1) {
      throw new Error('Signal.remove() : Listener does not exist')
    }

    this._listeners.splice(listenerId)

    return this
  }

  /**
   * Remove all listeners
   *
   * @returns {this}
   */
  removeAll () {
    this._listeners = []

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
    this._dispatchNb++

    if (this._dispatchNb > MAX_DISPATCH_NB) {
      throw new Error('Signal.dispatch() : Maximum dispatch limit reached (prevent infinite loop)')
    }

    for (let i = 0, listenersLength = this._listeners.length; i < listenersLength; i++) {
      const listener = this._listeners[i]

      if (listener.once) {
        this._listeners.splice(i)
      }

      const propagation = listener.function.call(listener.context, ...args)

      if (propagation === false) {
        break
      }
    }

    return this
  }

  /**
   * Get the number of listeners
   *
   * @returns {number} Listeners number
   */
  getListenersNb () {
    return this._listeners.length
  }

  /**
   * Get listener index
   *
   * @private
   *
   * @param {listenerCallback} cb Callback
   * @param {any} [context=this] Context
   *
   * @returns {number} Listener index, default to -1 if the listener is not found
   */
  _getListernerIndex (cb, context) {
    for (let i = 0, listenersLength = this._listeners.length; i < listenersLength; i++) {
      if (this._listeners[i].function === cb && this._listeners[i].context === context) {
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
