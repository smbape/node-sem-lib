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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BinaryTreeNode = __webpack_require__(11); // Here are some differences:
// * This isn't a map structure: it's just a tree. There are no keys: the
//   comparator applies to the values.
// * We use the passed comparator.


module.exports = /*#__PURE__*/function (_BinaryTreeNode) {
  _inherits(RedBlackTreeNode, _BinaryTreeNode);

  var _super = _createSuper(RedBlackTreeNode);

  function RedBlackTreeNode(value) {
    var _this;

    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, RedBlackTreeNode);

    _this = _super.call(this, value, parent);
    _this.isRed = true; // null nodes -- leaves -- are black

    return _this;
  }

  return _createClass(RedBlackTreeNode);
}(BinaryTreeNode);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

module.exports = isNumeric;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var isNumeric = __webpack_require__(1);
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

module.exports = toInteger;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RedBlackTreeNode = __webpack_require__(0);

var toInteger = __webpack_require__(2);

var hasProp = Object.hasOwnProperty; // Debugging purpose

var globalCounter = 0;

var Inwaiting = /*#__PURE__*/function (_RedBlackTreeNode) {
  _inherits(Inwaiting, _RedBlackTreeNode);

  var _super = _createSuper(Inwaiting);

  function Inwaiting(semID, task, priority, num, options) {
    var _this;

    _classCallCheck(this, Inwaiting);

    _this = _super.call(this);
    _this.value = _assertThisInitialized(_this);
    _this.id = ++globalCounter;
    _this.taken = 0;
    _this.task = task;
    _this.priority = priority;
    _this.num = num;
    _this.semaphore = semID;

    if (options) {
      ["onTimeOut", "onCancel", "unfair", "shouldTakeToken", "hasMissingToken", "sync", "hasNext"].forEach(function (prop) {
        if (hasProp.call(options, prop)) {
          _this[prop] = options[prop];
        }
      });
    }

    return _this;
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
      var _this2 = this;

      // Remove properties to allow garbage collection
      Object.keys(this).forEach(function (prop) {
        switch (prop) {
          case "cancel":
          case "id":
          case "num":
          case "scheduled":
          case "taken":
            break;

          default:
            delete _this2[prop];
        }
      }); // Prevent usage of these methods on a destroyed object

      ["addCounter", "setPriority", "destroy"].forEach(function (prop) {
        _this2[prop] = undefined;
      });
      this.destroyed = true;
    }
  }]);

  return Inwaiting;
}(RedBlackTreeNode);

module.exports = Inwaiting;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Semaphore = __webpack_require__(5);

var Inwaiting = __webpack_require__(3);

Object.assign(exports, {
  semCreate: function semCreate() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _construct(Semaphore, args);
  },
  Semaphore: Semaphore,
  Inwaiting: Inwaiting
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AbstractSortedSet = __webpack_require__(7);

var RedBlackTreeStrategy = __webpack_require__(8);

var createIterator = __webpack_require__(12);

var isNumeric = __webpack_require__(1);

var toInteger = __webpack_require__(2);

var Inwaiting = __webpack_require__(3);

var isObject = function isObject(obj) {
  return typeof obj === "object" && obj !== null;
};

var idComparator = function idComparator(a, b) {
  return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
};

var priorityComparator = function priorityComparator(a, b) {
  return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
};

var onlyOnce = function onlyOnce(fn) {
  return function () {
    if (fn === null) {
      throw new Error("Callback was already called.");
    }

    var callFn = fn;
    fn = null;
    callFn.apply(null, arguments);
  };
};

var hasProp = Object.hasOwnProperty; // Debugging purpose

var globalCounter = 0;

var SortedSet = /*#__PURE__*/function (_AbstractSortedSet) {
  _inherits(SortedSet, _AbstractSortedSet);

  var _super = _createSuper(SortedSet);

  function SortedSet() {
    _classCallCheck(this, SortedSet);

    return _super.apply(this, arguments);
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
 * Return the number of available tokens
 * @return {Interger} number of available tokens
 */


Semaphore.prototype.getNumTokens = function getNumTokens() {
  return this._numTokens;
};
/**
 * Return the maximum of available tokens
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
 * @param {Boolean}  allow capacity overflow
 */


Semaphore.prototype.semGive = function semGive(num, overflow) {
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

  if (!overflow && this._numTokens > this._capacity) {
    this._numTokens = this._capacity;
  }

  this._semTake(overflow);

  if (overflow && this._numTokens > this._capacity) {
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
  var _this2 = this;

  var onTimeOut = item.onTimeOut,
      taken = item.taken;

  this._removeItem(item);

  if (taken !== 0) {
    // give on next tick to wait for all synchronous canceled to be done
    this._setImmediate(function () {
      _this2.semGive(taken, true);
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

  if (typeof result === "function") {
    result(item);
  } else if (isObject(result)) {
    result.addCounter = item.addCounter.bind(item);
    result.cancel = item.cancel.bind(item);
    result.setPriority = item.setPriority.bind(item);
  }

  this._insertItem(item);

  if (isNumeric(timeOut) && timeOut > 0) {
    item.timer = setTimeout(this.handleTimeout.bind(this, item), timeOut);
  }

  this._semTake();

  return item;
};

Semaphore.prototype._shouldTakeToken = function _shouldTakeToken(item, num) {
  // avoid giving item as context when calling shouldTakeToken
  return typeof item.shouldTakeToken !== "function" || (0, item.shouldTakeToken)(num, item.num, item.taken, this);
};

Semaphore.prototype._hasMissingToken = function _hasMissingToken(item) {
  if (typeof item.hasMissingToken === "function") {
    // avoid giving item as context when calling hasMissingToken
    (0, item.hasMissingToken)(this);
  }
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
        group = null;
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
  if (this._taking) {
    return;
  }

  if (typeof this.keepAlive === "undefined") {
    this._keepAlive();
  }

  this._taking = true;

  while (this._checkKeepAlive(this._destroyWaiting)) {
    var _this$_nextGroupItem = this._nextGroupItem(),
        _this$_nextGroupItem2 = _slicedToArray(_this$_nextGroupItem, 2),
        group = _this$_nextGroupItem2[0],
        item = _this$_nextGroupItem2[1];

    if (item == null) {
      break;
    }

    var weakerIterator = void 0,
        weakeGroup = void 0,
        weakerItemIterator = void 0,
        weakerItem = void 0; // if item is still waiting for tokens

    if (item.num > this._numTokens) {
      item.taken += this._numTokens;
      item.num -= this._numTokens;
      this._numTokens = 0; // take token from tasks with weaker priority

      if (item.unfair && this._queue.length !== 1) {
        weakerIterator = this._queue.endIterator().previous();

        while (weakerIterator && item.num !== 0) {
          weakeGroup = weakerIterator.value();

          if (weakeGroup === group || weakeGroup.priority <= this.priority) {
            // can only be unfair on tasks with lower priority that semaphore default priority
            break;
          }

          weakerItemIterator = weakeGroup.stack.endIterator().previous();
          weakerItem = weakerItemIterator ? weakerItemIterator.value() : null;

          while (weakerItem && item.num !== 0) {
            if (weakerItem.taken > 0 && this._shouldTakeToken(item, Math.min(item.num, weakerItem.taken))) {
              var taken = item.num > weakerItem.taken ? weakerItem.taken : item.num;
              item.taken += taken;
              item.num -= taken;
              weakerItem.num += taken;
              weakerItem.taken -= taken;
            }

            weakerItemIterator = weakerItemIterator.previous();
            weakerItem = weakerItemIterator ? weakerItemIterator.value() : null;
          }

          if (item.num === 0) {
            break;
          }

          weakerIterator = weakerIterator ? weakerIterator.previous() : null;
        }
      } // if item is still waiting for tokens, try again at next give or flush


      if (item.num !== 0) {
        this._hasMissingToken(item);

        break;
      }
    }

    if (item.num !== 0) {
      item.taken += item.num;

      if (this._numTokens !== Number.POSITIVE_INFINITY) {
        this._numTokens -= item.num;
      }

      item.num = 0;
    }

    this._runTask(item, topSync);
  }

  this._taking = false;
};

Semaphore.prototype._runTask = function (item, topSync) {
  var _this3 = this;

  var sync = typeof topSync !== "undefined" ? topSync : typeof item.sync !== "undefined" ? item.sync : this.sync;
  var taken = item.taken,
      task = item.task,
      onCancel = item.onCancel,
      hasNext = item.hasNext;

  if (sync) {
    if (!hasNext || typeof hasNext !== "function" || !hasNext.call(item)) {
      this._removeItem(item); // Prevent usage of cancel


      item.cancel = undefined;
    }

    task();
    return;
  } // Non blocking call of callback
  // A way to loop through in waiting tasks without blocking
  // the semaphore process until done


  var timerID = this._setImmediate(function () {
    timerID = null;
    task();
  });

  item.cancel = function () {
    // Prevent usage of cancel
    item.cancel = undefined;

    _this3._clearImmediate(timerID);

    timerID = null; // give on next tick to wait for all synchronous canceled to be done

    _this3._setImmediate(function () {
      _this3.semGive(taken, true);
    });

    if (typeof onCancel === "function") {
      onCancel();
    }
  }; // call hasNext after cancel is set to allow hasNext


  if (!hasNext || typeof hasNext !== "function" || !hasNext.call(item)) {
    this._removeItem(item);
  }
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
  var _this4 = this;

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

  var iterator = createIterator(collection);

  if (iterator === null) {
    callback();
    return null;
  }

  callback = onlyOnce(callback);
  var cancellers = [];
  var errors = [];
  var items = [];
  var item;
  var waiting = 0;
  var canceled = false;
  var done = false;
  var loops = 0;
  var hasError = false;

  var hasNext = function hasNext() {
    if (done) {
      return false;
    }

    var nextItem = iterator();

    if (nextItem === null) {
      done = true;
      return false;
    }

    items.push(nextItem);
    cancellers.push(item.cancel);
    delete item.cancel;
    waiting++;
    item.num = 1; // tell _semTake that we still need tokens

    item.taken = 0; // reset taken to prevent unfair taken of this item

    return true;
  };

  var replenish = function replenish() {
    if (loops++ !== 0) {
      return;
    }

    for (; loops > 0; loops--) {
      // synchronous replenish may cause waiting to be 0 without
      // being the execution passing it to 0
      // therefore, remember what decrease this execution caused
      // TODO: find a test case that will fail without this
      var owaiting = --waiting;

      _this4.semGive();

      if (!canceled && owaiting === 0 && done) {
        callback(errors.length === 0 ? undefined : errors);
      }
    }
  };

  var onTake = function onTake() {
    if (hasError || items.length === item.scheduled) {
      replenish();
      return;
    }

    var i = item.scheduled;
    var nextItem = items[i];
    cancellers[i] = null;
    item.scheduled++;

    var give = function give(err) {
      nextItem.done = true;
      cancellers[i] = undefined;

      if (err) {
        hasError = true;
        errors[i] = err;
        nextItem.error = err;
      }

      replenish();
    };

    var key = nextItem.key,
        value = nextItem.value;
    nextItem.done = false;
    nextItem.iteratee = typeof iteratee === "function" ? iteratee : value;
    var icancel = typeof iteratee === "function" ? iteratee(value, key, give) : value(give);

    if (cancellers[i] !== undefined && icancel) {
      cancellers[i] = function () {
        cancellers[i] = null;

        if (typeof icancel === "function") {
          icancel();
        } else if (typeof icancel === "object") {
          if (typeof icancel.cancel === "function") {
            icancel.cancel();
          } else if (typeof icancel.abort === "function") {
            icancel.abort();
          }
        }
      };
    }
  };

  var onCancel = function onCancel() {
    canceled = true;

    if (!done) {
      _this4._removeItem(item); // remove item since there is no more token needed and _semTake will not remove it

    }

    cancellers.forEach(function (cancel) {
      if (typeof cancel === "function") {
        cancel();
      }
    });
    var err = new Error("canceled");
    err.code = "CANCELED";
    callback(err);
  };

  waiting++;
  item = this.semTake({
    priority: priority,
    onTake: onTake,
    hasNext: hasNext
  }, function (_item) {
    item = _item;
    item.scheduled = 0;
  });

  if (waiting === 0) {
    return item;
  }

  return new Proxy(item, {
    get: function get(target, prop, receiver) {
      if (prop === "cancel") {
        return waiting === 0 || canceled ? undefined : onCancel;
      }

      if (prop === "setPriority") {
        return target.setPriority.bind(target);
      }

      if (prop === "scheduled") {
        return Reflect.get.apply(Reflect, arguments);
      }

      return undefined;
    }
  });
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

  var group, itemIterator, item;

  while (iterator) {
    group = iterator.value();

    if (group != null && group.stack.length !== 0) {
      itemIterator = group.stack.beginIterator();

      while (itemIterator) {
        item = itemIterator.value();

        if (item != null) {
          count += item.num;
        }

        itemIterator = itemIterator.next();
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

module.exports = Semaphore;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

module.exports = /*#__PURE__*/function () {
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AbstractBinaryTreeStrategy = __webpack_require__(9);

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


var removeFromNode = function removeFromNode(node, value, compare, allowNode) {
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

    node.left = removeFromNode(node.left, value, compare, allowNode);

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
      value = findMinNode(node.right).value;
      var right = removeMinNode(node.right);

      if (allowNode && value instanceof RedBlackTreeNode) {
        value.left = node.left;

        if (value.left !== null) {
          value.left.parent = value;
        }

        value.parent = node.parent;
        value.isRed = node.isRed;
        node = value;
      }

      node.value = value;
      node.right = right;
    } else {
      node.right = removeFromNode(node.right, value, compare, allowNode);
    }

    if (node.right !== null) {
      node.right.parent = node;
    }
  }

  return fixUp(node);
}; // // const removeFromNodeStask = new Array(1024);
// const removeFromNode = (node, value, compare, allowNode) => {
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
//                     value = findMinNode(node.right).value;
//                     const right = removeMinNode(node.right);
//                     if (allowNode && value instanceof RedBlackTreeNode) {
//                         value.left = node.left;
//                         if (value.left !== null) {
//                             value.left.parent = value;
//                         }
//                         value.parent = node.parent;
//                         value.isRed = node.isRed;
//                         node = value;
//                     }
//                     node.value = value;
//                     node.right = right;
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


module.exports = /*#__PURE__*/function (_AbstractBinaryTreeSt) {
  _inherits(RedBlackTreeStrategy, _AbstractBinaryTreeSt);

  var _super = _createSuper(RedBlackTreeStrategy);

  function RedBlackTreeStrategy() {
    _classCallCheck(this, RedBlackTreeStrategy);

    return _super.apply(this, arguments);
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
      this.root = removeFromNode(this.root, value, this.comparator, this.allowNode);

      if (this.root !== null) {
        this.root.parent = null;
        this.root.isRed = false;
      }
    }
  }]);

  return RedBlackTreeStrategy;
}(AbstractBinaryTreeStrategy);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var BinaryTreeIterator = __webpack_require__(10); // const binaryTreeTraverse = (node, callback, some) => {
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


module.exports = /*#__PURE__*/function () {
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
/* 10 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

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


var BinaryTreeIterator = /*#__PURE__*/function () {
  function BinaryTreeIterator(tree, node) {
    _classCallCheck(this, BinaryTreeIterator);

    this.tree = tree;
    this.node = node;
  }

  _createClass(BinaryTreeIterator, [{
    key: "next",
    value: function next() {
      if (this.node === null) {
        return null;
      }

      var node = moveCursor("right", this.node);
      return node === null ? null : new BinaryTreeIterator(this.tree, node);
    }
  }, {
    key: "previous",
    value: function previous() {
      if (this.node === null) {
        if (this.tree.root === null) {
          return null;
        }

        var _node = descendAllTheWay("right", this.tree.root);

        return _node === null ? null : new BinaryTreeIterator(this.tree, _node);
      }

      var node = moveCursor("left", this.node);
      return node === null ? null : new BinaryTreeIterator(this.tree, node);
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      return this.next() !== null;
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

      if (this.node === null) {
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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = /*#__PURE__*/_createClass(function BinaryTreeNode(value) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, BinaryTreeNode);

  this.value = value;
  this.left = null;
  this.right = null;
  this.parent = parent;
});

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var createArrayIterator = function createArrayIterator(arr) {
  var i = 0;
  var len = arr.length;
  return function next() {
    return i < len ? {
      key: i,
      value: arr[i++]
    } : null;
  };
};

var createObjectIterator = function createObjectIterator(obj) {
  var i = 0;
  var keys = Object.keys(obj);
  var len = keys.length;
  return function next() {
    return i < len ? {
      key: keys[i],
      value: obj[keys[i++]]
    } : null;
  };
};

var createIterableIterator = function createIterableIterator(iterable) {
  var iterator = iterable[Symbol.iterator]();
  return function next() {
    var item = iterator.next();
    return item === null || typeof item !== "object" ? item : item.done ? null : item;
  };
};

var iterator = function iterator(obj) {
  if (obj === null || typeof obj !== "object") {
    return null;
  }

  return Array.isArray(obj) ? createArrayIterator(obj) : Symbol.iterator in obj ? createIterableIterator(obj) : createObjectIterator(obj);
};

module.exports = iterator;

/***/ })
/******/ ]);
});
//# sourceMappingURL=sem-lib.js.map