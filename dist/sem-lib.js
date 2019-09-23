(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["semLib"] = factory();
	else
		root["semLib"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BinaryTreeNode = __webpack_require__(4); // Here are some differences:
// * This isn't a map structure: it's just a tree. There are no keys: the
//   comparator applies to the values.
// * We use the passed comparator.


module.exports =
/*#__PURE__*/
function (_BinaryTreeNode) {
  _inherits(RedBlackTreeNode, _BinaryTreeNode);

  function RedBlackTreeNode(value) {
    var _this;

    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, RedBlackTreeNode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RedBlackTreeNode).call(this, value, parent));
    _this.isRed = true; // null nodes -- leaves -- are black

    return _this;
  }

  return RedBlackTreeNode;
}(BinaryTreeNode);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AbstractSortedSet = __webpack_require__(3);

var RedBlackTreeNode = __webpack_require__(0);

var RedBlackTreeStrategy = __webpack_require__(5);

var isNumeric = function isNumeric(obj) {
  if (obj === undefined || obj === null || Array.isArray(obj)) {
    return false;
  }

  var parsed = parseFloat(obj);

  if (obj === parsed) {
    return true;
  }

  return obj - parsed + 1 >= 0;
};

var isObject = function isObject(obj) {
  return typeof obj === "object" && obj !== null;
};
/**
 * Value of parsed interger or default value if not a number or < 0
 * @param  {Any} num value to parse
 * @param  {Interger} _default default value
 * @return {Interger} parsing result
 */


var toInteger = function toInteger(num, positive, _default) {
  if (!isNumeric(num)) {
    return _default;
  }

  if (num === Number.POSITIVE_INFINITY) {
    return num;
  }

  if (num === Number.NEGATIVE_INFINITY) {
    return positive ? _default : num;
  }

  num = parseInt(num, 10);
  return positive && num < 0 ? _default : num;
};

var idComparator = function idComparator(a, b) {
  return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
};

var priorityComparator = function priorityComparator(a, b) {
  return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
};

var hasProp = Object.hasOwnProperty; // Debugging purpose

var globalCounter = 0;

var SortedSet =
/*#__PURE__*/
function (_AbstractSortedSet) {
  _inherits(SortedSet, _AbstractSortedSet);

  function SortedSet() {
    _classCallCheck(this, SortedSet);

    return _possibleConstructorReturn(this, _getPrototypeOf(SortedSet).apply(this, arguments));
  }

  _createClass(SortedSet, [{
    key: "get",
    value: function get(value) {
      var comparator = this.priv.comparator;
      var node = this.priv.root;
      var cmp;

      while (node !== null) {
        cmp = comparator(value, node.value);

        if (cmp === 0) {
          break;
        } else if (cmp < 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }

      return node === null ? undefined : node.value;
    }
  }]);

  return SortedSet;
}(AbstractSortedSet);

var Inwaiting =
/*#__PURE__*/
function (_RedBlackTreeNode) {
  _inherits(Inwaiting, _RedBlackTreeNode);

  function Inwaiting(semID, task, priority, num, options) {
    var _this2;

    _classCallCheck(this, Inwaiting);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Inwaiting).call(this));
    _this2.value = _assertThisInitialized(_this2);
    _this2.id = ++globalCounter;
    _this2.taken = 0;
    _this2.task = task;
    _this2.priority = priority;
    _this2.num = num;
    _this2.semaphore = semID;

    if (options) {
      ["onTimeOut", "onCancel", "unfair", "shouldTakeToken", "sync"].forEach(function (prop) {
        if (hasProp.call(options, prop)) {
          _this2[prop] = options[prop];
        }
      });
    }

    return _this2;
  }

  _createClass(Inwaiting, [{
    key: "addCounter",
    value: function addCounter(nextNum) {
      this.num += toInteger(nextNum, true, 1);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var onCancel = this.onCancel,
          taken = this.taken,
          semID = this.semaphore;

      semID._removeItem(this);

      if (taken !== 0) {
        // give on next tick to wait for all synchronous canceled to be done
        semID._setImmediate(function () {
          semID.semGive(taken, true);
        });
      }

      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  }, {
    key: "setPriority",
    value: function setPriority(nextPriority) {
      if (this.group == null) {
        return;
      }

      var semID = this.semaphore;
      nextPriority = toInteger(nextPriority, false, semID.priority);

      if (nextPriority === this.priority) {
        return;
      }

      this.group.stack.remove(this);

      if (this.group.stack.length === 0) {
        // No more inWaiting for this priority group
        semID._queue.remove(this.group);
      }

      this.priority = nextPriority;

      semID._insertItem(this);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;

      // Remove properties to allow garbage collection
      Object.keys(this).forEach(function (prop) {
        if (prop !== "id") {
          delete _this3[prop];
        }
      }); // Prevent usage of these methods on a destroyed object

      ["addCounter", "cancel", "setPriority", "destroy"].forEach(function (prop) {
        _this3[prop] = undefined;
      });
      this.destroyed = true;
    }
  }]);

  return Inwaiting;
}(RedBlackTreeNode);
/**
 * @param  {Integer} capacity (default = 1) Number of tokens that can be handled by the Semaphore
 * @param  {Boolean} isFull   (default = false) if true object is created with tokens
 * @param  {Integer} priority (default = 15) default priority
 * @param  {Boolean} sync     if true tasks will be run synchronously
 */


function Semaphore(capacity, isFull, priority) {
  var sync = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var _queue = new SortedSet({
    comparator: priorityComparator,
    strategy: RedBlackTreeStrategy
  });

  this.id = ++globalCounter;
  this._capacity = toInteger(capacity, true, 1);
  this._queue = _queue;
  this._numTokens = isFull ? this._capacity : 0; // eslint-disable-next-line no-magic-numbers

  this.priority = toInteger(priority, false, 15);
  this.sync = sync;
}
/**
 * Return number of available tokens
 * @return {Interger} number of available tokens
 */


Semaphore.prototype.getNumTokens = function getNumTokens() {
  return this._numTokens;
};
/**
 * Return maximum of available tokens
 * @return {Integer} maximum of available tokens
 */


Semaphore.prototype.getCapacity = function getCapacity() {
  return this._capacity;
};
/**
 * Set the maximum of available tokens
 * @return {Integer} maximum of available tokens
 */


Semaphore.prototype.setCapacity = function setCapacity(capacity) {
  this._capacity = toInteger(capacity, true, this._capacity);
};
/**
 * Add tokens to the Semaphore
 *
 * @param {Interger} num Number of tokens to add
 */


Semaphore.prototype.semGive = function semGive(num, isGivenBack) {
  if (this.destroyed) {
    return false;
  }

  if (num !== Number.POSITIVE_INFINITY) {
    num = toInteger(num, true, 1);

    if (num < 1) {
      num = 1;
    }

    this._numTokens += num;
  } else {
    this._numTokens = num;
  }

  if (!isGivenBack && this._numTokens > this._capacity) {
    this._numTokens = this._capacity;
  }

  this._semTake(isGivenBack);

  if (isGivenBack && this._numTokens > this._capacity) {
    this._numTokens = this._capacity;
  }

  return true;
};
/**
 * Give tokens to every inwaiting tasks
 */


Semaphore.prototype.semFlush = function semFlush() {
  if (this.destroyed) {
    return false;
  }

  this._numTokens = 0;

  this._queue.forEach(function (group) {
    group.stack.forEach(function (item) {
      item.num = 0;
    });
  });

  this._semTake();

  return true;
};

Semaphore.prototype.handleTimeout = function handleTimeout(item) {
  var _this4 = this;

  var onTimeOut = item.onTimeOut,
      taken = item.taken;

  this._removeItem(item);

  if (taken !== 0) {
    // give on next tick to wait for all synchronous canceled to be done
    this._setImmediate(function () {
      _this4.semGive(taken, true);
    });
  }

  if (typeof onTimeOut === "function") {
    onTimeOut();
  }
};
/**
 * Wait for Semaphore availability before calling onTake callback
 * @example
 * semTake(Function[, takeInstance]);
 * semTake(Settings[, takeInstance]);
 *
 * @param {Object} options options with the following properties:
 * <ul>
 * <li>{Function} <b><em>onTake</em></b></li>: called on successful take
 * <li>{Integer} <b><em>num</em></b></li>(optional, default = 1): Number of tokens to take before calling onTake callback
 * <li>{Integer} <b><em>priority</em></b></li>(optional): task priority, smaller is higher priority
 * <li>{Number} <b><em>timeOut</em></b></li>(optional): milliseconds to wait before timeOut. If !(options['timeOut'] > 0), waiting will last forever
 * <li>{Function} <b><em>onTimeOut</em></b></li>(optional): called if timeOut occurs
 * </ul>
 * @return {Object|false} item item.addCounter(n = 1) => wait for n more tokens
 */


Semaphore.prototype.semTake = function semTake(options, result) {
  if (this.destroyed) {
    return false;
  }

  var hasOptions = isObject(options);
  var task, timeOut, num, priority;

  if (hasOptions) {
    task = options.onTake;
    priority = options.priority;
    num = options.num;
    timeOut = options.timeOut;
  } else if (typeof options === "function") {
    task = options;
    options = null;
  }

  if (typeof task !== "function") {
    task = Function.prototype;
  }

  num = toInteger(num, true, 1);
  priority = toInteger(priority, false, this.priority);
  var item = new Inwaiting(this, task, priority, num, hasOptions ? options : false);

  this._insertItem(item);

  if (isNumeric(timeOut) && timeOut > 0) {
    item.timer = setTimeout(this.handleTimeout.bind(this, item), timeOut);
  }

  if (isObject(result)) {
    result.addCounter = item.addCounter.bind(item);
    result.cancel = item.cancel.bind(item);
    result.setPriority = item.setPriority.bind(item);
  }

  this._semTake();

  return item;
};

Semaphore.prototype._shouldTakeToken = function _shouldTakeToken(item, num) {
  // avoid giving item as context when calling shouldTakeToken
  return typeof item.shouldTakeToken !== "function" || (0, item.shouldTakeToken)(num, item.num, item.taken, this);
};

Semaphore.prototype._nextGroupItem = function _nextGroupItem() {
  var groupIterator, group, itemIterator, item;
  groupIterator = this._queue.beginIterator();
  group = groupIterator.value();
  itemIterator = group.stack.beginIterator();
  item = itemIterator.value();

  while (item && item.num !== 0 && !this._shouldTakeToken(item, Math.min(item.num, this._numTokens))) {
    item = null;
    itemIterator = itemIterator.next();

    if (itemIterator === null) {
      groupIterator = groupIterator.next();

      if (groupIterator === null) {
        break;
      }

      group = groupIterator.value();

      if (group === null) {
        break;
      }

      itemIterator = group.stack.beginIterator();
    }

    item = itemIterator.value();
  }

  return [group, item];
};
/**
 * Take tokens if available
 *
 */


Semaphore.prototype._semTake = function _semTake(topSync) {
  var _this5 = this;

  if (this.taking) {
    return;
  }

  if (typeof this.keepAlive === "undefined") {
    this._keepAlive();
  }

  this.taking = true;

  var _loop = function _loop() {
    var _this5$_nextGroupItem = _this5._nextGroupItem(),
        _this5$_nextGroupItem2 = _slicedToArray(_this5$_nextGroupItem, 2),
        group = _this5$_nextGroupItem2[0],
        item = _this5$_nextGroupItem2[1];

    if (item == null) {
      return "break";
    }

    var weakerIterator = void 0,
        wearkeGroup = void 0,
        weakerItemIterator = void 0,
        weakerItem = void 0; // if item is still waiting for tokens

    if (item.num > _this5._numTokens) {
      item.taken += _this5._numTokens;
      item.num -= _this5._numTokens;
      _this5._numTokens = 0; // take token from tasks with weaker priority

      if (item.unfair && _this5._queue.length !== 1) {
        weakerIterator = _this5._queue.endIterator().previous();

        while (weakerIterator && item.num !== 0) {
          wearkeGroup = weakerIterator.value();

          if (wearkeGroup === group || wearkeGroup.priority <= _this5.priority) {
            // can only be unfair on tasks with lower priority that semaphore default priority
            break;
          }

          weakerItemIterator = wearkeGroup.stack.endIterator().previous();
          weakerItem = weakerItemIterator ? weakerItemIterator.value() : null;

          while (weakerItem && item.num !== 0) {
            if (weakerItem.taken > 0 && _this5._shouldTakeToken(item, Math.min(item.num, weakerItem.taken))) {
              if (item.num > weakerItem.taken) {
                weakerItem.num += weakerItem.taken;
                item.num -= weakerItem.taken;
                weakerItem.taken = 0;
              } else {
                weakerItem.taken -= item.num;
                weakerItem.num += item.num;
                item.num = 0;
              }
            }

            weakerItemIterator = weakerItemIterator.previous();
            weakerItem = weakerItemIterator ? weakerItemIterator.value() : null;
          }

          weakerIterator = weakerIterator ? weakerIterator.previous() : null;
        }
      } // if item is still waiting for tokens, try again at next give or flush


      if (item.num !== 0) {
        return "break";
      }
    }

    item.taken += item.num;

    if (_this5._numTokens !== Number.POSITIVE_INFINITY) {
      _this5._numTokens -= item.num;
    }

    item.num = 0;
    var sync = typeof topSync !== "undefined" ? topSync : typeof item.sync !== "undefined" ? item.sync : _this5.sync;
    var taken = item.taken,
        task = item.task,
        onCancel = item.onCancel;

    _this5._removeItem(item);

    if (sync) {
      task();
    } else {
      // Non blocking call of callback
      // A way to loop through in waiting tasks without blocking
      // the semaphore process until done
      var timerID = _this5._setImmediate(function () {
        timerID = null;
        task();
      });

      item.cancel = function () {
        _this5._clearImmediate(timerID);

        timerID = null; // give on next tick to wait for all synchronous canceled to be done

        _this5._setImmediate(function () {
          _this5.semGive(taken, true);
        });

        if (typeof onCancel === "function") {
          onCancel();
        }
      };
    }
  };

  while (this._checkKeepAlive(this._destroyWaiting)) {
    var _ret = _loop();

    if (_ret === "break") break;
  }

  this.taking = false;
};
/**
 * Destroy all inwaiting tasks
 * @param  {Boolean} safe if true, wait for all inwaiting tasks to be performed, else, destroy with no warn
 */


Semaphore.prototype.destroy = function (safe, onDestroy) {
  if (this._destroying) {
    return false;
  }

  this._destroying = true;
  this.__onDestroy = onDestroy;

  if (safe !== false) {
    this._destroyWaiting = true;

    this._semTake();

    return true;
  }

  return this._destroy(safe);
};

Semaphore.prototype._destroy = function (safe) {
  this._destroyWaiting = false;

  var i, _len, j, _jlen; // for loop to avoid infinite loop with while


  for (i = 0, _len = this._queue.length; i < _len; i++) {
    var group = this._queue.beginIterator().value();

    for (j = 0, _jlen = group.stack.length; j < _jlen; j++) {
      var item = group.stack.beginIterator().value();

      if (safe !== false) {
        item.cancel();
      }

      this._removeItem(item);
    }
  }

  if (this._checkKeepAlive()) {
    return false;
  }

  var __onDestroy = this.__onDestroy;
  this.destroyed = true;

  if ("function" === typeof __onDestroy) {
    __onDestroy();
  }

  return true;
};

Semaphore.prototype.schedule = function (collection, priority, iteratee, callback) {
  var semID = this;

  switch (arguments.length) {
    case 2:
      if (typeof priority === "function") {
        callback = priority;
        priority = null;
      }

      break;

    case 3:
      callback = iteratee;
      iteratee = null;

      if ("function" === typeof priority) {
        iteratee = priority;
        priority = null;
      }

      break;

    default: // Nothing to do

  }

  if (callback == null) {
    callback = Function.prototype;
  }

  var count = 0;
  var index = -1;
  var isArray = Array.isArray(collection);
  var keys = isArray ? null : Object.keys(collection);
  var len = isArray ? collection.length : keys.length;

  if (len === 0) {
    callback();
    return null;
  }

  var items = new Array(len);
  var doneCalled = false;
  var canceled = false;
  var taken = 0;
  var errors = new Array(len);
  var hasError = false;

  var onTake = function onTake(coll, i) {
    taken++;
    items[i] = null;
    var key = isArray ? i : keys[i];
    var called = false;

    var next = function next(err) {
      if (called) {
        throw new Error("callback already called");
      }

      called = true;
      items[i] = null;
      semID.semGive();
      taken--;

      if (doneCalled) {
        return;
      }

      if (canceled && !err) {
        err = new Error("canceled");
        err.code = "CANCELED";
      }

      if (err) {
        if (!hasError) {
          hasError = true;

          if (!canceled) {
            cancel();
          }
        }

        errors[i] = err;
      }

      if (++count === len || hasError && taken === 0) {
        doneCalled = true;

        if (canceled) {
          errors.code = "CANCELED";
        }

        callback(hasError ? errors : null);
      }
    };

    if (canceled) {
      next();
      return;
    }

    var icancel = typeof iteratee === "function" ? iteratee(coll[key], key, next) : coll[key](next);
    items[i] = {
      cancel: function cancel() {
        if (typeof icancel === "function") {
          icancel();
        } else if (icancel !== null && typeof icancel === "object") {
          if (typeof icancel.cancel === "function") {
            icancel.cancel();
          } else if (typeof icancel.abort === "function") {
            icancel.abort();
          }
        }
      }
    };
  };

  var iterate = function iterate(i) {
    var item = semID.semTake({
      priority: priority,
      onTake: onTake.bind(null, collection, i)
    });
    var proxy = {
      cancel: item.cancel ? function () {
        item.cancel();
        onTake(collection, i);
      } : undefined
    };

    var _loop2 = function _loop2(key) {
      if (key === "cancel") {
        return "continue";
      }

      Object.defineProperty(proxy, key, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return item[key];
        },
        set: function set(value) {
          item[key] = value;
          return value;
        }
      });
    };

    for (var key in item) {
      var _ret2 = _loop2(key);

      if (_ret2 === "continue") continue;
    }

    return proxy;
  };

  var loop = function loop() {
    do {
      ++index;
      items[index] = iterate(index);
    } while (index !== len - 1);
  };

  function cancel() {
    if (canceled) {
      return;
    }

    canceled = true;

    for (var i = 0, size = items.length; i < size; i++) {
      if (items[i] !== null && typeof items[i] === "object" && typeof items[i].cancel === "function") {
        items[i].cancel();
        items[i] = null;
      }
    }
  }

  var setPriority = function setPriority(nextPriority) {
    for (var i = 0, size = items.length; i < size; i++) {
      if (items[i] !== null && typeof items[i] === "object" && typeof items[i].setPriority === "function") {
        items[i].setPriority(nextPriority);
      }
    }
  };

  loop();
  return {
    setPriority: setPriority,
    cancel: cancel
  };
};

Semaphore.prototype._insertItem = function (item) {
  var group = this._queue.get({
    priority: item.priority
  });

  if (!group) {
    group = this._insertGroup(item);
  }

  group.stack.insert(item);
  item.group = group;
};

Semaphore.prototype._checkKeepAlive = function _checkKeepAlive(_destroyWaiting) {
  if (this._hasInWaitingTask()) {
    return true;
  }

  if (this.keepAlive) {
    clearTimeout(this.keepAlive);
    delete this.keepAlive;
  }

  if (_destroyWaiting) {
    this._destroy();
  }

  return false;
};

Semaphore.prototype.isAlive = function isAlive() {
  return Boolean(this.keepAlive);
};

Semaphore.prototype.hasInWaitingTask = function hasInWaitingTask() {
  return hasProp.call(this, "_queue") && this._hasInWaitingTask();
};

Semaphore.prototype._countInWaitingTokens = function _countInWaitingTokens() {
  var count = 0;

  if (!this.hasInWaitingTask()) {
    return count;
  }

  var iterator = this._queue.beginIterator();

  var group, itemerator, item;

  while (iterator) {
    group = iterator.value();

    if (group != null && group.stack.length !== 0) {
      itemerator = group.stack.beginIterator();

      while (itemerator) {
        item = itemerator.value();

        if (item != null) {
          count += item.num;
        }

        itemerator = itemerator.next();
      }
    }

    iterator = iterator.next();
  }

  return count;
};

Semaphore.prototype._hasInWaitingTask = function _hasInWaitingTask() {
  return this._queue.length !== 0;
};

Semaphore.prototype._keepAlive = function _keepAlive() {
  if (!this._hasInWaitingTask()) {
    return;
  }

  var _this = this;

  this.keepAlive = setTimeout(function () {
    _this._keepAlive();
  }, 1000);
};
/**
 * Remove item from a priority group
 *
 */


Semaphore.prototype._removeItem = function _removeItem(item) {
  if (item.timer) {
    clearTimeout(item.timer);
  }

  item.group.stack.remove(item);

  if (item.group.stack.length === 0) {
    // No more inWaiting for this priority group
    this._queue.remove(item.group);

    this._checkKeepAlive();
  }

  item.destroy();
};

Semaphore.prototype._insertGroup = function _insertGroup(item) {
  var stack = new SortedSet({
    comparator: idComparator,
    strategy: RedBlackTreeStrategy,
    allowNode: true
  });
  var group = {
    priority: item.priority,
    stack: stack
  };

  this._queue.insert(group);

  return group;
};

Semaphore.prototype._setImmediate = function () {
  if (typeof global === "object" && typeof global.setImmediate === "function") {
    return global.setImmediate;
  }

  return function (fn) {
    return setTimeout(fn, 1);
  };
}();

Semaphore.prototype._clearImmediate = function () {
  if (typeof global === "object" && typeof global.clearImmediate === "function") {
    return global.clearImmediate;
  }

  return function (id) {
    clearTimeout(id);
  };
}();

Object.assign(exports, {
  semCreate: function semCreate() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key = 0; _key < _len2; _key++) {
      args[_key] = arguments[_key];
    }

    return _construct(Semaphore, args);
  },
  Semaphore: Semaphore,
  Inwaiting: Inwaiting
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
  // This works if the window reference is available
  if (typeof window === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function AbstractSortedSet(options) {
    _classCallCheck(this, AbstractSortedSet);

    if (options === null || typeof options !== "object" || typeof options.strategy !== "function") {
      throw new Error("Must pass options.strategy, a strategy");
    }

    if (options === null || typeof options !== "object" || typeof options.comparator !== "function") {
      throw new Error("Must pass options.comparator, a comparator");
    }

    this.priv = new options.strategy(options);
    this.length = 0;
  }

  _createClass(AbstractSortedSet, [{
    key: "insert",
    value: function insert(value) {
      this.priv.insert(value);
      this.length += 1;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(value) {
      this.priv.remove(value);
      this.length -= 1;
      return this;
    }
  }, {
    key: "contains",
    value: function contains(value) {
      return this.priv.contains(value);
    } // Returns this set as an Array

  }, {
    key: "toArray",
    value: function toArray() {
      return this.priv.toArray();
    }
  }, {
    key: "forEach",
    value: function forEach(callback, thisArg) {
      this.priv.forEachImpl(callback, this, thisArg);
    }
  }, {
    key: "map",
    value: function map(callback, thisArg) {
      var ret = [];
      this.priv.forEachImpl(function (value, index, self) {
        ret.push(callback.call(thisArg, value, index, self));
      }, this, thisArg);
      return ret;
    }
  }, {
    key: "filter",
    value: function filter(callback, thisArg) {
      var ret = [];
      this.priv.forEachImpl(function (value, index, self) {
        if (callback.call(thisArg, value, index, self)) {
          ret.push(value);
        }
      }, this, thisArg);
      return ret;
    }
  }, {
    key: "every",
    value: function every(callback, thisArg) {
      var ret = true;
      this.priv.forEachImpl(function (value, index, self) {
        if (!callback.call(thisArg, value, index, self)) {
          ret = false;
        }

        return !ret;
      }, this, thisArg, true);
      return ret;
    }
  }, {
    key: "some",
    value: function some(callback, thisArg) {
      var ret = false;
      this.priv.forEachImpl(function (value, index, self) {
        if (callback.call(thisArg, value, index, self)) {
          ret = true;
        }

        return ret;
      }, this, thisArg);
      return ret;
    } // An iterator is similar to a C++ iterator: it points _before_ a value.
    // So in this sorted set:
    //   | 1 | 2 | 3 | 4 | 5 |
    //   ^a      ^b          ^c
    // `a` is a pointer to the beginning of the iterator. `a.value()` returns
    // `3`. `a.previous()` returns `null`. `a.setValue()` works, if
    // `options.allowSetValue` is true.
    // `b` is a pointer to the value `3`. `a.previous()` and `a.next()` both do
    // the obvious.
    // `c` is a pointer to the `null` value. `c.previous()` works; `c.next()`
    // returns null. `c.setValue()` throws an exception, even if
    // `options.allowSetValue` is true.
    // Iterators have `hasNext()` and `hasPrevious()` methods, too.
    // Iterators are immutible. `iterator.next()` returns a new iterator.
    // Iterators become invalid as soon as `insert()` or `remove()` is called.

  }, {
    key: "findIterator",
    value: function findIterator(value) {
      return this.priv.findIterator(value);
    } // Finds an iterator pointing to the lowest possible value.

  }, {
    key: "beginIterator",
    value: function beginIterator() {
      return this.priv.beginIterator();
    } // Finds an iterator pointing to the `null` value.

  }, {
    key: "endIterator",
    value: function endIterator() {
      return this.priv.endIterator();
    }
  }]);

  return AbstractSortedSet;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function BinaryTreeNode(value) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, BinaryTreeNode);

  this.value = value;
  this.left = null;
  this.right = null;
  this.parent = parent;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AbstractBinaryTreeStrategy = __webpack_require__(6);

var RedBlackTreeNode = __webpack_require__(0); // An implementation of Left-Leaning Red-Black trees.
// It's copied from http://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf.
// It's practically a copy-paste job, minus the semicolons. missing bits were
// filled in with hints from
// https://www.teachsolaisgames.com/articles/balanced_left_leaning.html


var rotateLeft = function rotateLeft(node) {
  var tmp = node.right;
  tmp.parent = null;
  node.right = tmp.left;

  if (node.right !== null) {
    node.right.parent = node;
  }

  tmp.left = node;

  if (tmp.left !== null) {
    tmp.left.parent = tmp;
  }

  tmp.isRed = node.isRed;
  node.isRed = true;
  return tmp;
};

var rotateRight = function rotateRight(node) {
  var tmp = node.left;
  tmp.parent = null;
  node.left = tmp.right;

  if (node.left !== null) {
    node.left.parent = node;
  }

  tmp.right = node;

  if (tmp.right !== null) {
    tmp.right.parent = tmp;
  }

  tmp.isRed = node.isRed;
  node.isRed = true;
  return tmp;
};

var colorFlip = function colorFlip(node) {
  node.isRed = !node.isRed;
  node.left.isRed = !node.left.isRed;
  node.right.isRed = !node.right.isRed;
};

var moveRedLeft = function moveRedLeft(node) {
  //throw 'Preconditions failed' if !(!node.left.isRed && !node.left.left?.isRed)
  colorFlip(node);

  if (node.right !== null && node.right.left !== null && node.right.left.isRed) {
    node.right = rotateRight(node.right);
    node.right.parent = node;
    node = rotateLeft(node);
    colorFlip(node);
  }

  return node;
};

var moveRedRight = function moveRedRight(node) {
  //throw 'Preconditions failed' if !(!node.right.isRed && !node.right.left?.isRed)
  colorFlip(node);

  if (node.left !== null && node.left.left !== null && node.left.left.isRed) {
    node = rotateRight(node);
    colorFlip(node);
  }

  return node;
};

var insertInNode = function insertInNode(node, value, compare, allowNode, parent) {
  if (node === null) {
    if (allowNode && value instanceof RedBlackTreeNode) {
      if (!value.isRed) {
        value.isRed = true;
      }

      return value;
    }

    return new RedBlackTreeNode(value);
  } //if node.left isnt null && node.left.isRed && node.right isnt null && node.right.isRed
  //  colorFlip(node)


  if (node.value === value) {
    throw new Error("Value already in set");
  }

  if (compare(value, node.value) < 0) {
    node.left = insertInNode(node.left, value, compare, allowNode, node);
    node.left.parent = node;
  } else {
    node.right = insertInNode(node.right, value, compare, allowNode, node);
    node.right.parent = node;
  }

  if (node.right !== null && node.right.isRed && !(node.left !== null && node.left.isRed)) {
    node = rotateLeft(node);
  }

  if (node.left !== null && node.left.isRed && node.left.left !== null && node.left.left.isRed) {
    node = rotateRight(node);
  } // Put this here -- I couldn't get the whole thing to work otherwise :(


  if (node.left !== null && node.left.isRed && node.right !== null && node.right.isRed) {
    colorFlip(node);
  }

  return node;
};

var findMinNode = function findMinNode(node) {
  while (node.left !== null) {
    node = node.left;
  }

  return node;
};

var fixUp = function fixUp(node) {
  // Fix right-leaning red nodes
  if (node.right !== null && node.right.isRed) {
    node = rotateLeft(node);
  } // Handle a 4-node that traverses down the left


  if (node.left !== null && node.left.isRed && node.left.left !== null && node.left.left.isRed) {
    node = rotateRight(node);
  } // split 4-nodes


  if (node.left !== null && node.left.isRed && node.right !== null && node.right.isRed) {
    colorFlip(node);
  }

  return node;
};

var removeMinNode = function removeMinNode(node) {
  if (node.left === null) {
    return null;
  }

  if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
    node = moveRedLeft(node);
  }

  node.left = removeMinNode(node.left);

  if (node.left !== null) {
    node.left.parent = node;
  }

  return fixUp(node);
}; // // const removeMinNodeStack = new Array(1024);
// const removeMinNode = node => {
//     let pos = 0;
//     const removeMinNodeStack = [];
//     removeMinNodeStack[pos++] = node;
//     removeMinNodeStack[pos++] = 0;
//     // let stackSize = pos;
//     let ret;
//     while (pos !== 0) {
//         // if (pos > stackSize) {
//         //     stackSize = pos;
//         // }
//         if (removeMinNodeStack[--pos] === 0) {
//             node = removeMinNodeStack[--pos];
//             if (node.left === null) {
//                 ret = null;
//                 continue;
//             }
//             if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
//                 node = moveRedLeft(node);
//             }
//             removeMinNodeStack[pos++] = node;
//             removeMinNodeStack[pos++] = 1;
//             removeMinNodeStack[pos++] = node.left;
//             removeMinNodeStack[pos++] = 0;
//         } else {
//             node = removeMinNodeStack[--pos];
//             node.left = ret;
//             if (node.left !== null) {
//                 node.left.parent = node;
//             }
//             ret = fixUp(node);
//         }
//     }
//     // for (let i = 0; i < stackSize; i++) {
//     //     removeMinNodeStack[i] = undefined;
//     // }
//     return ret;
// };


var removeFromNode = function removeFromNode(node, value, compare) {
  if (node === null) {
    throw new Error("Value not in set");
  }

  if (node.value !== value && compare(value, node.value) < 0) {
    if (node.left === null) {
      throw new Error("Value not in set");
    }

    if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
      node = moveRedLeft(node);
    }

    node.left = removeFromNode(node.left, value, compare);

    if (node.left !== null) {
      node.left.parent = node;
    }
  } else {
    if (node.left !== null && node.left.isRed) {
      node = rotateRight(node);
    }

    if (node.right === null) {
      if (value === node.value) {
        return null; // leaf node; LLRB assures no left value here
      }

      throw new Error("Value not in set");
    }

    if (!node.right.isRed && !(node.right.left !== null && node.right.left.isRed)) {
      node = moveRedRight(node);
    }

    if (value === node.value) {
      node.value = findMinNode(node.right).value;
      node.right = removeMinNode(node.right);
    } else {
      node.right = removeFromNode(node.right, value, compare);
    }

    if (node.right !== null) {
      node.right.parent = node;
    }
  }

  return fixUp(node);
}; // // const removeFromNodeStask = new Array(1024);
// const removeFromNode = (node, value, compare) => {
//     let pos = 0;
//     const removeFromNodeStask = [];
//     removeFromNodeStask[pos++] = node;
//     removeFromNodeStask[pos++] = 0;
//     // let stackSize = pos;
//     let ret, cmd;
//     while (pos !== 0) {
//         // if (pos > stackSize) {
//         //     stackSize = pos;
//         // }
//         cmd = removeFromNodeStask[--pos];
//         // eslint-disable-next-line default-case
//         switch(cmd) {
//             case 0:
//                 node = removeFromNodeStask[--pos];
//                 if (node === null) {
//                     throw new Error("Value not in set");
//                 }
//                 if (node.value !== value && compare(value, node.value) < 0) {
//                     if (node.left === null) {
//                         throw new Error("Value not in set");
//                     }
//                     if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
//                         node = moveRedLeft(node);
//                     }
//                     removeFromNodeStask[pos++] = node;
//                     removeFromNodeStask[pos++] = 1;
//                     removeFromNodeStask[pos++] = node.left;
//                     removeFromNodeStask[pos++] = 0;
//                     break;
//                 }
//                 if (node.left !== null && node.left.isRed) {
//                     node = rotateRight(node);
//                 }
//                 if (node.right === null) {
//                     if (value === node.value) {
//                         ret = null; // leaf node; LLRB assures no left value here
//                         break;
//                     }
//                     throw new Error("Value not in set");
//                 }
//                 if (!node.right.isRed && !(node.right.left !== null && node.right.left.isRed)) {
//                     node = moveRedRight(node);
//                 }
//                 if (value === node.value) {
//                     node.value = findMinNode(node.right).value;
//                     node.right = removeMinNode(node.right);
//                     if (node.right !== null) {
//                         node.right.parent = node;
//                     }
//                     ret = fixUp(node);
//                     break;
//                 }
//                 removeFromNodeStask[pos++] = node;
//                 removeFromNodeStask[pos++] = 2;
//                 removeFromNodeStask[pos++] = node.right;
//                 removeFromNodeStask[pos++] = 0;
//                 break;
//             case 1:
//                 node = removeFromNodeStask[--pos];
//                 node.left = ret;
//                 if (node.left !== null) {
//                     node.left.parent = node;
//                 }
//                 ret = fixUp(node);
//                 break;
//             case 2:
//                 node = removeFromNodeStask[--pos];
//                 node.right = ret;
//                 if (node.right !== null) {
//                     node.right.parent = node;
//                 }
//                 ret = fixUp(node);
//                 break;
//         }
//     }
//     // for (let i = 0; i < stackSize; i++) {
//     //     removeFromNodeStask[i] = undefined;
//     // }
//     return ret;
// };


module.exports =
/*#__PURE__*/
function (_AbstractBinaryTreeSt) {
  _inherits(RedBlackTreeStrategy, _AbstractBinaryTreeSt);

  function RedBlackTreeStrategy() {
    _classCallCheck(this, RedBlackTreeStrategy);

    return _possibleConstructorReturn(this, _getPrototypeOf(RedBlackTreeStrategy).apply(this, arguments));
  }

  _createClass(RedBlackTreeStrategy, [{
    key: "insert",
    value: function insert(value) {
      this.root = insertInNode(this.root, value, this.comparator, this.allowNode);
      this.root.parent = null;
      this.root.isRed = false;
    }
  }, {
    key: "remove",
    value: function remove(value) {
      this.root = removeFromNode(this.root, value, this.comparator);

      if (this.root !== null) {
        this.root.parent = null;
        this.root.isRed = false;
      }
    }
  }]);

  return RedBlackTreeStrategy;
}(AbstractBinaryTreeStrategy);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BinaryTreeIterator = __webpack_require__(7); // const binaryTreeTraverse = (node, callback, some) => {
//     if (node === null) {
//         return false;
//     }
//     let ret;
//     ret = binaryTreeTraverse(node.left, callback, some);
//     if (some && ret) {
//         return true;
//     }
//     ret = callback(node.value);
//     if (some && ret) {
//         return true;
//     }
//     ret = binaryTreeTraverse(node.right, callback, some);
//     if (some && ret) {
//         return true;
//     }
//     return false;
// };
// Not subject to stackoverflow


var binaryTreeTraverse = function binaryTreeTraverse(node, callback, some) {
  if (node === null) {
    return;
  }

  var stack = [1, node.right, 0, node.value, 1, node.left];
  var pos = stack.length;
  var ret;

  while (pos !== 0) {
    pos -= 2;
    node = stack[pos + 1];

    if (stack[pos] === 0) {
      ret = callback(node);

      if (some && ret) {
        break;
      }
    } else if (node !== null) {
      stack[pos++] = 1;
      stack[pos++] = node.right;
      stack[pos++] = 0;
      stack[pos++] = node.value;
      stack[pos++] = -1;
      stack[pos++] = node.left;
    }
  }
}; // An AbstractBinaryTreeStrategy has a @root. @root is null or an object with
// `.left`, `.right` and `.value` properties.


module.exports =
/*#__PURE__*/
function () {
  function AbstractBinaryTreeStrategy(options) {
    _classCallCheck(this, AbstractBinaryTreeStrategy);

    this.root = null;
    this.comparator = options.comparator;
    this.allowSetValue = options.allowSetValue;
    this.allowNode = options.allowNode;
  }

  _createClass(AbstractBinaryTreeStrategy, [{
    key: "toArray",
    value: function toArray() {
      var ret = [];
      binaryTreeTraverse(this.root, function (value) {
        ret.push(value);
      });
      return ret;
    }
  }, {
    key: "forEachImpl",
    value: function forEachImpl(callback, sortedSet, thisArg, some) {
      if (typeof thisArg === "undefined") {
        thisArg = sortedSet;
      }

      var i = 0;
      binaryTreeTraverse(this.root, function (value) {
        return callback.call(thisArg, value, i++, sortedSet);
      }, some);
    }
  }, {
    key: "contains",
    value: function contains(value) {
      var comparator = this.comparator;
      var node = this.root;
      var cmp;

      while (node !== null) {
        cmp = comparator(value, node.value);

        if (cmp === 0) {
          break;
        } else if (cmp < 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }

      return node !== null && node.value === value;
    }
  }, {
    key: "findIterator",
    value: function findIterator(value) {
      return BinaryTreeIterator.find(this, value, this.comparator);
    }
  }, {
    key: "beginIterator",
    value: function beginIterator() {
      return BinaryTreeIterator.left(this);
    }
  }, {
    key: "endIterator",
    value: function endIterator() {
      return BinaryTreeIterator.right(this);
    }
  }]);

  return AbstractBinaryTreeStrategy;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var descendAllTheWay = function descendAllTheWay(leftOrRight, node) {
  while (node[leftOrRight] !== null) {
    node = node[leftOrRight];
  }

  return node;
};

var moveCursor = function moveCursor(leftOrRight, node) {
  var parent, rightOrLeft;

  if (node[leftOrRight] !== null) {
    parent = node;
    node = node[leftOrRight];
    rightOrLeft = leftOrRight === "left" ? "right" : "left";
    node = descendAllTheWay(rightOrLeft, node);
  } else {
    while ((parent = node.parent) !== null && parent[leftOrRight] === node) {
      node = parent;
    }

    node = parent; // either null or the correct-direction parent
  }

  return node;
}; // The BinaryTreeIterator actually writes to the tree: it maintains a
// "parent" variable on each node. Please ignore this.


var BinaryTreeIterator =
/*#__PURE__*/
function () {
  function BinaryTreeIterator(tree, node) {
    _classCallCheck(this, BinaryTreeIterator);

    this.tree = tree;
    this.node = node;
  }

  _createClass(BinaryTreeIterator, [{
    key: "next",
    value: function next() {
      return this.node === null ? null : new BinaryTreeIterator(this.tree, moveCursor("right", this.node));
    }
  }, {
    key: "previous",
    value: function previous() {
      if (this.node === null) {
        if (this.tree.root === null) {
          return null;
        }

        return new BinaryTreeIterator(this.tree, descendAllTheWay("right", this.tree.root));
      }

      var node = moveCursor("left", this.node);
      return node === null ? null : new BinaryTreeIterator(this.tree, node);
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      return this.node !== null;
    }
  }, {
    key: "hasPrevious",
    value: function hasPrevious() {
      return this.previous() !== null;
    }
  }, {
    key: "value",
    value: function value() {
      return this.node === null ? null : this.node.value;
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      if (!this.tree.allowSetValue) {
        throw new Error("Must set options.allowSetValue");
      }

      if (!this.hasNext()) {
        throw new Error("Cannot set value at end of set");
      }

      this.node.value = value;
      return value;
    }
  }]);

  return BinaryTreeIterator;
}();

BinaryTreeIterator.find = function (tree, value, comparator) {
  var node = tree.root;
  var nextNode = null; // For finding an in-between node

  var cmp;

  while (node !== null) {
    cmp = comparator(value, node.value);

    if (cmp === 0) {
      break;
    }

    if (cmp < 0) {
      if (node.left === null) {
        break;
      } // If we descend all right after this until there are
      // no more right nodes, we want to return an
      // "in-between" iterator ... pointing here.


      nextNode = node;
      node = node.left;
    } else if (node.right !== null) {
      node = node.right;
    } else {
      node = nextNode;
      break;
    }
  }

  return new BinaryTreeIterator(tree, node);
};

BinaryTreeIterator.left = function (tree) {
  if (tree.root === null) {
    return new BinaryTreeIterator(tree, null);
  }

  var node = descendAllTheWay("left", tree.root);
  return new BinaryTreeIterator(tree, node);
};

BinaryTreeIterator.right = function (tree) {
  return new BinaryTreeIterator(tree, null);
};

module.exports = BinaryTreeIterator;

/***/ })
/******/ ]);
});
//# sourceMappingURL=sem-lib.js.map