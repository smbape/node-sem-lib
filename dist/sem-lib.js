(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["semLib"] = factory();
	else
		root["semLib"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var AbstractSortedSet = __webpack_require__(2);
var RedBlackTreeStrategy = __webpack_require__(3);

var hasProp = Object.hasOwnProperty;

var inherits = function inherits(child, parent) {
    for (var key in parent) {
        if (hasProp.call(parent, key)) {
            child[key] = parent[key];
        }
    }

    function ctor() {
        // eslint-disable-next-line no-invalid-this
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;return child;
};

function SortedSet(options) {
    if (options == null) {
        options = {};
    }
    if (!options.strategy) {
        options.strategy = RedBlackTreeStrategy;
    }
    SortedSet.__super__.constructor.call(this, options);
}

inherits(SortedSet, AbstractSortedSet);

SortedSet.prototype.add = SortedSet.prototype.insert;

SortedSet.prototype.get = function (value) {
    // Use our optimzed get on RedBlackTreeStrategy
    return this.priv.get(value);
};

// Optimization: take the first match.
RedBlackTreeStrategy.prototype.get = function (value) {
    var comparator = this.comparator;
    var node = this.root;
    var cmp = void 0;

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
};

var isNumeric = function isNumeric(obj) {
    return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
};

var isObject = function isObject(obj) {
    return typeof obj === "object" && obj !== null;
};

// Debugging purpose
var globalCounter = 0;

/**
 * Value of parsed interger or default value if not a number or < 0
 * @param  {Any} num value to parse
 * @param  {Interger} _default default value
 * @return {Interger} parsing result
 */
function toPositiveInt(num, _default) {
    if (isNumeric(num)) {
        num = parseInt(num, 10);
    } else {
        return _default;
    }
    if (num < 0) {
        return _default;
    }

    return num;
}

/**
 * @constructor
 *
 * @param {Integer} capacity (default = 1) Number of tokens that can be handled by the Semaphore
 * @param {Boolean} isFull (default = false) if true object is created with tokens
 * @param {Integer} priority (default = 15) default priority
 */
function Semaphore(capacity, isFull, priority) {
    if (isNumeric(capacity)) {
        capacity = parseInt(capacity, 10);
        if (capacity <= 0) {
            capacity = Number.POSITIVE_INFINITY;
        }
    } else if (capacity !== Number.POSITIVE_INFINITY) {
        capacity = 1;
    } else {
        isFull = false;
    }

    var queue = new SortedSet({
        comparator: priorityComparator
    });

    this.id = ++globalCounter;
    this._capacity = capacity;
    this._queue = queue;
    this._numTokens = isFull ? capacity : 0;
    // eslint-disable-next-line no-magic-numbers
    this.priority = isNumeric(priority) ? parseInt(priority, 10) : 15;
}

Semaphore.prototype.setImmediateTick = function () {
    if (typeof global === "object" && typeof global.setImmediate === "function") {
        return global.setImmediate;
    }

    return function (fn) {
        return setTimeout(fn, 1);
    };
}();

Semaphore.prototype.clearImmediateTick = function () {
    if (typeof global === "object" && typeof global.clearImmediate === "function") {
        return global.clearImmediate;
    }

    return function (id) {
        clearTimeout(id);
    };
}();

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
 * Add tokens to the Semaphore
 *
 * @param {Interger} num Number of tokens to add
 */
Semaphore.prototype.semGive = function semGive(num, checkLimitAfter) {
    if (this.destroyed) {
        return false;
    }

    if (num !== Number.POSITIVE_INFINITY) {
        num = toPositiveInt(num, 1);
        if (num < 1) {
            num = 1;
        }
        this._numTokens += num;
    } else {
        this._numTokens = num;
    }

    if (!checkLimitAfter && this._numTokens > this._capacity) {
        this._numTokens = this._capacity;
    }

    this._semTake();

    if (checkLimitAfter && this._numTokens > this._capacity) {
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

/**
 * Wait for Semaphore availability before calling onTake callback
 * @example
 * semTake(Function[, takeInstance]);
 * semTake(Settings[, takeInstance]);
 *
 * @param {Object} settings settings with the following properties:
 * <ul>
 * <li>{Function} <b><em>onTake</em></b></li>: called on successful take
 * <li>{Integer} <b><em>num</em></b></li>(optional, default = 1): Number of tokens to take before calling onTake callback
 * <li>{Integer} <b><em>priority</em></b></li>(optional): task priority, smaller is higher priority
 * <li>{Number} <b><em>timeOut</em></b></li>(optional): milliseconds to wait before timeOut. If !(settings['timeOut'] > 0), waiting will last forever
 * <li>{Function} <b><em>onTimeOut</em></b></li>(optional): called if timeOut occurs
 * </ul>
 * @return {Object|false} item item.addCounter(n = 1) => wait for n more tokens
 */
Semaphore.prototype.semTake = function semTake(settings, result) {
    var _this2 = this;

    var task, timeOut, onTimeOut, num, priority;

    if (this.destroyed) {
        return false;
    }

    if (isObject(settings)) {
        task = settings.onTake;
        priority = settings.priority;
        num = settings.num;
        timeOut = settings.timeOut;
        onTimeOut = settings.onTimeOut;
    } else if (typeof settings === "function") {
        task = settings;
        settings = {};
    }

    if (typeof task !== "function") {
        task = Function.prototype;
    }

    num = toPositiveInt(num, 1);
    priority = toPositiveInt(priority, this.priority);

    var item = {
        id: ++globalCounter,
        task: task,
        priority: priority,
        num: num,
        onTimeOut: onTimeOut,
        semaphore: this,
        taken: 0,
        cancel: function cancel() {
            var taken = item.taken;
            _this2._removeItem(item);
            _this2.semGive(taken, true);
        },
        setPriority: function setPriority(priority) {
            priority = toPositiveInt(priority, _this2.priority);
            if (priority === item.priority) {
                return;
            }

            item.group.stack.remove(item);
            if (item.group.stack.length === 0) {
                // No more inWaiting for this priority group
                item.semaphore._queue.remove(item.group);
            }

            item.priority = priority;
            _this2._addItemPriority(item);
        }
    };

    this._addItemPriority(item);

    if (isNumeric(timeOut) && timeOut > 0) {
        item.timer = setTimeout(function () {
            var taken = item.taken;
            _this2._removeItem(item);
            _this2.semGive(taken, true);
            if (typeof onTimeOut === "function") {
                onTimeOut();
            }
        }, timeOut);
    }

    var res = {
        addCounter: function addCounter(num) {
            item.num += toPositiveInt(num, 1);
        },
        cancel: function cancel() {
            item.cancel();
        },
        setPriority: function setPriority(priority) {
            item.setPriority(priority);
        }
    };

    if (isObject(result)) {
        result.addCounter = res.addCounter;
        result.cancel = res.cancel;
        result.setPriority = res.setPriority;
    }

    this._semTake();
    return res;
};

/**
 * Take tokens if available
 *
 */
Semaphore.prototype._semTake = function _semTake() {
    var _this3 = this;

    if (!this._hasInWaitingTask()) {
        if (this._destroyWaiting) {
            this._destroy();
        }
        return;
    }

    if (typeof this.keepAlive === "undefined") {
        this._keepAlive();
    }

    var group = this._queue.beginIterator().value();
    var item = group.stack.beginIterator().value();

    // if item is still waiting for tokens, try again at next give or flush
    if (item.num > this._numTokens) {
        item.taken += this._numTokens;
        item.num -= this._numTokens;
        this._numTokens = 0;
        return;
    }

    item.taken += item.num;
    if (this._numTokens !== Number.POSITIVE_INFINITY) {
        this._numTokens -= item.num;
    }
    item.num = 0;

    var task = item.task;
    var taken = item.taken;
    this._removeItem(item);

    // Non blocking call of callback
    // A way to loop through in waiting tasks without blocking
    // semaphore the process until done
    var timerID = this.setImmediateTick(function () {
        item.cancel = Function.prototype;
        task();
    });
    item.cancel = function () {
        if (timerID) {
            _this3.clearImmediateTick(timerID);
            timerID = null;
            _this3.semGive(taken, true);
        }
    };

    if (this._checkKeepAlive(this._destroyWaiting)) {
        this._semTake();
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

    // for loop to avoid infinite loop with while
    for (var i = 0, _len = this._queue.length; i < _len; i++) {
        var group = this._queue.beginIterator().value();
        var item = group.stack.beginIterator().value();

        if (safe !== false) {
            item.cancel();
        }
        this._removeItem(item);
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

Semaphore.prototype.schedule = function (collection, priority, iteratee, done) {
    var semID = this;

    switch (arguments.length) {
        case 2:
            if (typeof priority === "function") {
                done = priority;
                priority = null;
            }
            break;
        case 3:
            done = iteratee;
            iteratee = null;

            if ("function" === typeof priority) {
                iteratee = priority;
                priority = null;
            }
            break;
        default:
        // Nothing to do
    }

    if (done == null) {
        done = Function.prototype;
    }

    var count = 0;
    var index = -1;
    var isArray = Array.isArray(collection);
    var keys = isArray ? null : Object.keys(collection);
    var len = isArray ? collection.length : keys.length;

    if (len === 0) {
        done();
        return null;
    }

    var items = new Array(len);
    var doneCalled = false;
    var canceled = false;
    var taken = 0;
    var errors = new Array(len);
    var hasError = false;

    var onTake = function onTake(collection, index) {
        taken++;
        items[index] = null;
        var key = isArray ? index : keys[index];

        var called = false;
        var next = function next(err) {
            if (called) {
                throw new Error("callback already called");
            }
            called = true;
            items[index] = null;

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
                errors[index] = err;
            }

            if (++count === len || hasError && taken === 0) {
                doneCalled = true;
                if (canceled) {
                    errors.code = "CANCELED";
                }
                done(hasError ? errors : null);
            }
        };

        var icancel = typeof iteratee === "function" ? iteratee(collection[key], key, next) : collection[key](next);

        if (typeof icancel === "function") {
            items[index] = {
                cancel: icancel
            };
        } else if (icancel !== null && typeof icancel === "object" && typeof icancel.cancel === "function") {
            items[index] = icancel;
        }
    };

    var iterate = function iterate(index) {
        return semID.semTake({
            priority: priority,
            onTake: onTake.bind(null, collection, index)
        });
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
        for (var i = 0, _len2 = items.length; i < _len2; i++) {
            if (items[i] !== null && typeof items[i] === "object" && typeof items[i].cancel === "function") {
                items[i].cancel();
                items[i] = null;
            }
        }
    }

    var setPriority = function setPriority(priority) {
        for (var i = 0, _len3 = items.length; i < _len3; i++) {
            if (items[i] !== null && typeof items[i] === "object" && typeof items[i].setPriority === "function") {
                items[i].setPriority(priority);
            }
        }
    };

    loop();

    return {
        setPriority: setPriority,
        cancel: cancel
    };
};

Semaphore.prototype._addItemPriority = function (item) {
    var group = this._queue.get({
        priority: item.priority
    });
    if (!group) {
        group = this._addGroup(item);
    }
    group.stack.add(item);
    item.group = group;
};

Semaphore.prototype._checkKeepAlive = function _checkKeepAlive(_destroyWaiting) {
    if (this._hasInWaitingTask()) {
        return true;
    }

    clearTimeout(this.keepAlive);
    delete this.keepAlive;
    if (_destroyWaiting) {
        this._destroy();
    }
    return false;
};

Semaphore.prototype.isAlive = function isAlive() {
    return Boolean(this.keepAlive);
};

Semaphore.prototype.hasInWaitingTask = function hasInWaitingTask() {
    return hasProp.call(this, "queue") && this._hasInWaitingTask();
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
        item.semaphore._queue.remove(item.group);

        item.semaphore._checkKeepAlive();
    }

    // Remove properties to allow garbage collector
    // eslint-disable-next-line guard-for-in
    for (var property in item) {
        if (property !== "id") {
            delete item[property];
        }
    }
};

Semaphore.prototype._addGroup = function _addGroup(item) {

    var stack = new SortedSet({
        comparator: idComparator
    });

    var group = {
        priority: item.priority,
        stack: stack
    };
    item.semaphore._queue.add(group);
    return group;
};

function idComparator(a, b) {
    return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
}

function priorityComparator(a, b) {
    return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
}

exports.semCreate = function () {
    var semID = Object.create(Semaphore.prototype);
    Semaphore.apply(semID, arguments);
    return semID;
};

// Allow customization/Patch fix from outside
exports.Semaphore = Semaphore;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var AbstractSortedSet;

module.exports = AbstractSortedSet = (function() {
  function AbstractSortedSet(options) {
    if ((options != null ? options.strategy : void 0) == null) {
      throw 'Must pass options.strategy, a strategy';
    }
    if ((options != null ? options.comparator : void 0) == null) {
      throw 'Must pass options.comparator, a comparator';
    }
    this.priv = new options.strategy(options);
    this.length = 0;
  }

  AbstractSortedSet.prototype.insert = function(value) {
    this.priv.insert(value);
    this.length += 1;
    return this;
  };

  AbstractSortedSet.prototype.remove = function(value) {
    this.priv.remove(value);
    this.length -= 1;
    return this;
  };

  AbstractSortedSet.prototype.contains = function(value) {
    return this.priv.contains(value);
  };

  AbstractSortedSet.prototype.toArray = function() {
    return this.priv.toArray();
  };

  AbstractSortedSet.prototype.forEach = function(callback, thisArg) {
    this.priv.forEachImpl(callback, this, thisArg);
    return this;
  };

  AbstractSortedSet.prototype.map = function(callback, thisArg) {
    var ret;
    ret = [];
    this.forEach(function(value, index, self) {
      return ret.push(callback.call(thisArg, value, index, self));
    });
    return ret;
  };

  AbstractSortedSet.prototype.filter = function(callback, thisArg) {
    var ret;
    ret = [];
    this.forEach(function(value, index, self) {
      if (callback.call(thisArg, value, index, self)) {
        return ret.push(value);
      }
    });
    return ret;
  };

  AbstractSortedSet.prototype.every = function(callback, thisArg) {
    var ret;
    ret = true;
    this.forEach(function(value, index, self) {
      if (ret && !callback.call(thisArg, value, index, self)) {
        return ret = false;
      }
    });
    return ret;
  };

  AbstractSortedSet.prototype.some = function(callback, thisArg) {
    var ret;
    ret = false;
    this.forEach(function(value, index, self) {
      if (!ret && callback.call(thisArg, value, index, self)) {
        return ret = true;
      }
    });
    return ret;
  };

  AbstractSortedSet.prototype.findIterator = function(value) {
    return this.priv.findIterator(value);
  };

  AbstractSortedSet.prototype.beginIterator = function() {
    return this.priv.beginIterator();
  };

  AbstractSortedSet.prototype.endIterator = function() {
    return this.priv.endIterator();
  };

  return AbstractSortedSet;

})();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var AbstractBinaryTreeStrategy, Node, RedBlackTreeStrategy, colorFlip, findMinNode, fixUp, insertInNode, moveRedLeft, moveRedRight, removeFromNode, removeMinNode, rotateLeft, rotateRight,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AbstractBinaryTreeStrategy = __webpack_require__(4);

Node = (function() {
  function Node(value1) {
    this.value = value1;
    this.left = null;
    this.right = null;
    this.isRed = true;
  }

  return Node;

})();

rotateLeft = function(h) {
  var x;
  x = h.right;
  h.right = x.left;
  x.left = h;
  x.isRed = h.isRed;
  h.isRed = true;
  return x;
};

rotateRight = function(h) {
  var x;
  x = h.left;
  h.left = x.right;
  x.right = h;
  x.isRed = h.isRed;
  h.isRed = true;
  return x;
};

colorFlip = function(h) {
  h.isRed = !h.isRed;
  h.left.isRed = !h.left.isRed;
  h.right.isRed = !h.right.isRed;
  return void 0;
};

moveRedLeft = function(h) {
  colorFlip(h);
  if (h.right !== null && h.right.left !== null && h.right.left.isRed) {
    h.right = rotateRight(h.right);
    h = rotateLeft(h);
    colorFlip(h);
  }
  return h;
};

moveRedRight = function(h) {
  colorFlip(h);
  if (h.left !== null && h.left.left !== null && h.left.left.isRed) {
    h = rotateRight(h);
    colorFlip(h);
  }
  return h;
};

insertInNode = function(h, value, compare) {
  if (h === null) {
    return new Node(value);
  }
  if (h.value === value) {
    throw 'Value already in set';
  } else {
    if (compare(value, h.value) < 0) {
      h.left = insertInNode(h.left, value, compare);
    } else {
      h.right = insertInNode(h.right, value, compare);
    }
  }
  if (h.right !== null && h.right.isRed && !(h.left !== null && h.left.isRed)) {
    h = rotateLeft(h);
  }
  if (h.left !== null && h.left.isRed && h.left.left !== null && h.left.left.isRed) {
    h = rotateRight(h);
  }
  if (h.left !== null && h.left.isRed && h.right !== null && h.right.isRed) {
    colorFlip(h);
  }
  return h;
};

findMinNode = function(h) {
  while (h.left !== null) {
    h = h.left;
  }
  return h;
};

fixUp = function(h) {
  if (h.right !== null && h.right.isRed) {
    h = rotateLeft(h);
  }
  if (h.left !== null && h.left.isRed && h.left.left !== null && h.left.left.isRed) {
    h = rotateRight(h);
  }
  if (h.left !== null && h.left.isRed && h.right !== null && h.right.isRed) {
    colorFlip(h);
  }
  return h;
};

removeMinNode = function(h) {
  if (h.left === null) {
    return null;
  }
  if (!h.left.isRed && !(h.left.left !== null && h.left.left.isRed)) {
    h = moveRedLeft(h);
  }
  h.left = removeMinNode(h.left);
  return fixUp(h);
};

removeFromNode = function(h, value, compare) {
  if (h === null) {
    throw 'Value not in set';
  }
  if (h.value !== value && compare(value, h.value) < 0) {
    if (h.left === null) {
      throw 'Value not in set';
    }
    if (!h.left.isRed && !(h.left.left !== null && h.left.left.isRed)) {
      h = moveRedLeft(h);
    }
    h.left = removeFromNode(h.left, value, compare);
  } else {
    if (h.left !== null && h.left.isRed) {
      h = rotateRight(h);
    }
    if (h.right === null) {
      if (value === h.value) {
        return null;
      } else {
        throw 'Value not in set';
      }
    }
    if (!h.right.isRed && !(h.right.left !== null && h.right.left.isRed)) {
      h = moveRedRight(h);
    }
    if (value === h.value) {
      h.value = findMinNode(h.right).value;
      h.right = removeMinNode(h.right);
    } else {
      h.right = removeFromNode(h.right, value, compare);
    }
  }
  if (h !== null) {
    h = fixUp(h);
  }
  return h;
};

module.exports = RedBlackTreeStrategy = (function(superClass) {
  extend(RedBlackTreeStrategy, superClass);

  function RedBlackTreeStrategy(options) {
    this.options = options;
    this.comparator = this.options.comparator;
    this.root = null;
  }

  RedBlackTreeStrategy.prototype.insert = function(value) {
    this.root = insertInNode(this.root, value, this.comparator);
    this.root.isRed = false;
    return void 0;
  };

  RedBlackTreeStrategy.prototype.remove = function(value) {
    this.root = removeFromNode(this.root, value, this.comparator);
    if (this.root !== null) {
      this.root.isRed = false;
    }
    return void 0;
  };

  return RedBlackTreeStrategy;

})(AbstractBinaryTreeStrategy);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var AbstractBinaryTree, BinaryTreeIterator, binaryTreeTraverse;

BinaryTreeIterator = __webpack_require__(5);

binaryTreeTraverse = function(node, callback) {
  if (node !== null) {
    binaryTreeTraverse(node.left, callback);
    callback(node.value);
    binaryTreeTraverse(node.right, callback);
  }
  return void 0;
};

AbstractBinaryTree = (function() {
  function AbstractBinaryTree() {}

  AbstractBinaryTree.prototype.toArray = function() {
    var ret;
    ret = [];
    binaryTreeTraverse(this.root, function(value) {
      return ret.push(value);
    });
    return ret;
  };

  AbstractBinaryTree.prototype.forEachImpl = function(callback, sortedSet, thisArg) {
    var i;
    i = 0;
    binaryTreeTraverse(this.root, function(value) {
      callback.call(thisArg, value, i, sortedSet);
      return i += 1;
    });
    return void 0;
  };

  AbstractBinaryTree.prototype.contains = function(value) {
    var cmp, comparator, node;
    comparator = this.comparator;
    node = this.root;
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
  };

  AbstractBinaryTree.prototype.findIterator = function(value) {
    return BinaryTreeIterator.find(this, value, this.comparator);
  };

  AbstractBinaryTree.prototype.beginIterator = function() {
    return BinaryTreeIterator.left(this);
  };

  AbstractBinaryTree.prototype.endIterator = function() {
    return BinaryTreeIterator.right(this);
  };

  return AbstractBinaryTree;

})();

module.exports = AbstractBinaryTree;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var BinaryTreeIterator, descendAllTheWay, moveCursor;

descendAllTheWay = function(leftOrRight, node) {
  var parent;
  while (node[leftOrRight] !== null) {
    parent = node;
    node = node[leftOrRight];
    node._iteratorParentNode = parent;
  }
  return node;
};

moveCursor = function(leftOrRight, node) {
  var parent, rightOrLeft;
  if (node[leftOrRight] !== null) {
    parent = node;
    node = node[leftOrRight];
    node._iteratorParentNode = parent;
    rightOrLeft = leftOrRight === 'left' ? 'right' : 'left';
    node = descendAllTheWay(rightOrLeft, node);
  } else {
    while ((parent = node._iteratorParentNode) !== null && parent[leftOrRight] === node) {
      node = parent;
    }
    node = parent;
  }
  return node;
};

BinaryTreeIterator = (function() {
  function BinaryTreeIterator(tree1, node1) {
    this.tree = tree1;
    this.node = node1;
  }

  BinaryTreeIterator.prototype.next = function() {
    var node;
    if (this.node === null) {
      return null;
    } else {
      node = moveCursor('right', this.node);
      return new BinaryTreeIterator(this.tree, node);
    }
  };

  BinaryTreeIterator.prototype.previous = function() {
    var node;
    if (this.node === null) {
      if (this.tree.root === null) {
        return null;
      } else {
        this.tree.root._iteratorParentNode = null;
        node = descendAllTheWay('right', this.tree.root);
        return new BinaryTreeIterator(this.tree, node);
      }
    } else {
      node = moveCursor('left', this.node);
      if (node === null) {
        return null;
      } else {
        return new BinaryTreeIterator(this.tree, node);
      }
    }
  };

  BinaryTreeIterator.prototype.hasNext = function() {
    return this.node !== null;
  };

  BinaryTreeIterator.prototype.hasPrevious = function() {
    return this.previous() !== null;
  };

  BinaryTreeIterator.prototype.value = function() {
    if (this.node === null) {
      return null;
    } else {
      return this.node.value;
    }
  };

  BinaryTreeIterator.prototype.setValue = function(value) {
    if (!this.tree.options.allowSetValue) {
      throw 'Must set options.allowSetValue';
    }
    if (!this.hasNext()) {
      throw 'Cannot set value at end of set';
    }
    return this.node.value = value;
  };

  return BinaryTreeIterator;

})();

BinaryTreeIterator.find = function(tree, value, comparator) {
  var cmp, nextNode, node, root;
  root = tree.root;
  if (root != null) {
    root._iteratorParentNode = null;
  }
  node = root;
  nextNode = null;
  while (node !== null) {
    cmp = comparator(value, node.value);
    if (cmp === 0) {
      break;
    } else if (cmp < 0) {
      if (node.left === null) {
        break;
      }
      nextNode = node;
      node.left._iteratorParentNode = node;
      node = node.left;
    } else {
      if (node.right !== null) {
        node.right._iteratorParentNode = node;
        node = node.right;
      } else {
        node = nextNode;
        break;
      }
    }
  }
  return new BinaryTreeIterator(tree, node);
};

BinaryTreeIterator.left = function(tree) {
  var node;
  if (tree.root === null) {
    return new BinaryTreeIterator(tree, null);
  } else {
    tree.root._iteratorParentNode = null;
    node = descendAllTheWay('left', tree.root);
    return new BinaryTreeIterator(tree, node);
  }
};

BinaryTreeIterator.right = function(tree) {
  return new BinaryTreeIterator(tree, null);
};

module.exports = BinaryTreeIterator;


/***/ })
/******/ ]);
});
//# sourceMappingURL=sem-lib.js.map