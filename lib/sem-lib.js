var EventEmitter = require("events").EventEmitter;

var SortedSet = require("js-sorted-set/lib/SortedSet");

SortedSet.prototype.add = SortedSet.prototype.insert;

SortedSet.prototype.get = function(value) {
    return this.priv.get(value);
};

SortedSet.RedBlackTreeStrategy.prototype.get = function(value) {
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
    return node !== null && node.value;
};

var utils = require("./utils.js");

var id = 0;

function numerize(num, val) {
    if (utils.isNumeric(num)) {
        num = parseInt(num, 10);
    } else {
        return val;
    }
    if (num < 0) {
        return val;
    }

    return num;
}

/**
 * Constructor
 *
 * @param {Integer} capacity (default = 1) Number of tokens that can be handled by the Semaphore
 * @param {Boolean} isFull (default = false) if true object is created with tokens
 * @param {Integer} defaultPriority (default = 15) default defaultPriority
 */
function _Semaphore(capacity, isFull, priority) {
    if (utils.isNumeric(capacity)) {
        capacity = parseInt(capacity, 10);
        if (capacity <= 0) {
            capacity = Number.POSITIVE_INFINITY;
        }
    } else if (capacity !== Number.POSITIVE_INFINITY) {
        capacity = 1;
    } else {
        isFull = false;
    }

    // var queue = new SortedSet(undefined,
    //     function(a, b) {
    //         return a.priority === b.priority;
    //     },
    //     function(a, b) {
    //         return a.priority - b.priority;
    //     }
    // );

    var queue = new SortedSet({
        comparator: function(a, b) {
            return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
        }
    });

    this.id = ++id;
    this.capacity = capacity;
    this.queue = queue;
    this.numTokens = (isFull) ? capacity : 0;
    this.priority = (priority >= 1) ? (priority) : 15;
}

_Semaphore.prototype.getId = function getId() {
    return this.id;
};

_Semaphore.prototype.getNumTokens = function getNumTokens() {
    return this.numTokens;
};

_Semaphore.prototype.getCapacity = function getCapacity() {
    return this.capacity;
};

/**
 * Add tokens to the Semaphore
 *
 * @param {Int} num Number of tokens to add
 */
_Semaphore.prototype.semGive = function semGive(num) {
    num = numerize(num, 1);
    if (num < 1) {
        num = 1;
    }
    this.numTokens += num;
    if (this.numTokens > this.capacity) {
        this.numTokens = this.capacity;
    }
    this._semTake();
};

/**
 * Give tokens to every waiting tasks
 *
 */
_Semaphore.prototype.semFlush = function semFlush() {
    this.numTokens = 0;
    this.queue.forEach(function(group) {
        group.stack.forEach(function(item) {
            item.num = 0;
        });
    });
    this._semTake();
};

/**
 * Wait for Semaphore availability before calling onTake callback
 *
 * @param {Object} settings : settings with the following properties:
 * <ul>
 * <li>{Object} <b><em>semaphore</em></b></li>: Semaphore private properties
 * <li>{Function} <b><em>onTake</em></b></li>: called on successful take
 * <li>{Integer} <b><em>num</em></b></li>(optional, default = 1): Number of tokens to take before calling onTake callback
 * <li>{Integer} <b><em>priority</em></b></li>(optional): task priority, smaller is higher priority
 * <li>{Number} <b><em>timeOut</em></b></li>(optional): milliseconds to wait before timeOut. If !(settings['timeOut'] > 0), waiting will last forever
 * <li>{Function} <b><em>onTimeOut</em></b></li>(optional): called if timeOut occurs
 * </ul>
 */
_Semaphore.prototype.semTake = function semTake(settings, result) {
    var task, priority, num, timeOut, onTimeOut;
    if (utils.isObject(settings)) {
        task = settings.onTake;
        priority = settings.priority;
        num = settings.num;
        timeOut = settings.timeOut;
        onTimeOut = settings.onTimeOut;
    } else if (typeof settings === 'function') {
        task = settings;
        settings = {};
    }

    if (typeof task !== 'function') {
        task = function() {};
        // throw new Error("Property onTake must exist and be a function");
    }

    num = numerize(num, 1);
    priority = numerize(priority, this.priority);

    var item = {
        id: ++id,
        task: task,
        priority: priority,
        num: num,
        onTimeOut: onTimeOut,
        semaphore: this
    };

    var group = this.queue.get({
        priority: item.priority
    });
    if (!group) {
        group = _addGroup(item);
    }
    group.stack.add(item);
    item.group = group;
    if (utils.isNumeric(timeOut) && timeOut > 0) {
        item.timer = setTimeout(function() {

            _removeItem(item);
            if (typeof onTimeOut === 'function') {
                onTimeOut();
            }
        }, timeOut);
    }

    var res = {};
    res.addCounter = function addCounter(num) {
        item.num += numerize(num, 1);
    };
    if (utils.isObject(result)) {
        result.addCounter = res.addCounter;
    }

    this._semTake();
    return res;
};

/**
 * Take tokens if available
 *
 */
_Semaphore.prototype._semTake = function _semTake() {
    if (!this.hasInWaitingTask()) {
        return;
    }

    if (typeof this.keepAlive === "undefined") {
        this._keepAlive();
    }

    var group = this.queue.beginIterator().value();
    var item = group.stack.beginIterator().value();

    //take as much as we can
    item.num += -this.numTokens;
    this.numTokens = (item.num > 0) ? 0 : -item.num;

    // item is still waiting for tokens, try again at next give or flush
    if (item.num > 0) {
        return;
    }

    if (item.timer) {
        clearTimeout(item.timer);
    }

    setImmediate(item.task);
    _removeItem(item);
    if (this._checkKeepAlive()) {

        this._semTake();
    }
};

_Semaphore.prototype._checkKeepAlive = function _checkKeepAlive() {
    if (!this.hasInWaitingTask()) {
        clearTimeout(this.keepAlive);
        delete this.keepAlive;
    }
    return true;
};

_Semaphore.prototype.hasInWaitingTask = function hasInWaitingTask() {
    return this.queue.length !== 0;
};

_Semaphore.prototype._keepAlive = function _keepAlive() {
    if (!this.hasInWaitingTask()) {
        return;
    }
    var self = this;
    this.keepAlive = setTimeout(function() {
        self._keepAlive();
    }, 1000);
};

/**
 * Remove item from a priority group
 *
 */
function _removeItem(item) {
    item.group.stack.remove(item);
    if (item.group.stack.length === 0) {
        // No more inWaiting for this priority group
        item.semaphore.queue.remove(item.group);

        item.semaphore._checkKeepAlive();
    }

    // Remove properties to allow garbage collector
    for (var property in item) {
        delete item[property];
    }
}

function _addGroup(item) {

    var stack = new SortedSet({
        comparator: function(a, b) {
            return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
        }
    });

    var group = {
        priority: item.priority,
        stack: stack
    };
    item.semaphore.queue.add(group);
    return group;
}

var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

// Wrap is not strictly needed
// I was trying to find a way to do private, public method based on method name
function semCreateWithWrapping() {
    var args = Array.prototype.slice.call(arguments);

    // Work around to call another constructor with parent scope arguments
    __extends(Private, _Semaphore);

    function Private() {
        Private.__super__.constructor.apply(this, args);
    }

    function Semaphore() {
        var self = new Private(), method;

        for (method in Private.__super__) {
            if (typeof self[method] !== "function" || method.charAt(0) === "_") {
                continue;
            }
            (function(instance, method) {
                if (/^(?:get|has|is|semTake)/.test(method)) {
                    instance[method] = function() {
                        return self[method].apply(self, arguments);
                    };
                } else {
                    instance[method] = function() {
                        self[method].apply(self, arguments);
                    };
                }
            }(this, method));
        }
    }
    return new Semaphore();
}

function semCreateWithoutWrapping() {
    var args = Array.prototype.slice.call(arguments);

    // Work around to call another constructor with parent scope arguments
    __extends(Private, _Semaphore);

    function Private() {
        Private.__super__.constructor.apply(this, args);
    }

    return new Private();
}

exports.semCreate = semCreateWithoutWrapping;

// Allow customization from outsied
exports._Semaphore = _Semaphore;