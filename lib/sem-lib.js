const AbstractSortedSet = require("js-sorted-set/src/SortedSet/AbstractSortedSet");
const RedBlackTreeStrategy = require("js-sorted-set/src/SortedSet/RedBlackTreeStrategy");

const hasProp = Object.hasOwnProperty;

const setImmediateTick = (function() {
    if (typeof global === "object" && typeof global.setImmediate === "function") {
        return global.setImmediate;
    }

    return function(fn) {
        return setTimeout(fn, 1);
    };
})();

const clearImmediateTick = (function() {
    if (typeof global === "object" && typeof global.clearImmediate === "function") {
        return global.clearImmediate;
    }

    return function(id) {
        clearTimeout(id);
    };
})();

const inherits = function(child, parent) {
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
    child.__super__ = parent.prototype; return child;
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

SortedSet.prototype.get = function(value) {
    // Use our optimzed get on RedBlackTreeStrategy
    return this.priv.get(value);
};

// Optimization: take the first match.
RedBlackTreeStrategy.prototype.get = function(value) {
    const comparator = this.comparator;
    let node = this.root;
    let cmp = undefined;

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

const isNumeric = function(obj) {
    return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
};

const isObject = function(obj) {
    return typeof obj === "object" && obj !== null;
};

// Debugging purpose
let globalCounter = 0;

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
    this._queue.forEach(function(group) {
        group.stack.forEach(function(item) {
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

    const item = {
        id: ++globalCounter,
        task: task,
        priority: priority,
        num: num,
        onTimeOut: onTimeOut,
        semaphore: this,
        taken: 0,
        cancel: () => {
            const taken = item.taken;
            this._removeItem(item);
            this.semGive(taken, true);
        },
        setPriority: (priority) => {
            priority = toPositiveInt(priority, this.priority);
            if (priority === item.priority) {
                return;
            }

            item.group.stack.remove(item);
            if (item.group.stack.length === 0) {
                // No more inWaiting for this priority group
                item.semaphore._queue.remove(item.group);
            }

            item.priority = priority;
            this._addItemPriority(item);
        }
    };

    this._addItemPriority(item);

    if (isNumeric(timeOut) && timeOut > 0) {
        item.timer = setTimeout(() => {
            const taken = item.taken;
            this._removeItem(item);
            this.semGive(taken, true);
            if (typeof onTimeOut === "function") {
                onTimeOut();
            }
        }, timeOut);
    }

    const res = {
        addCounter(num) {
            item.num += toPositiveInt(num, 1);
        },

        cancel() {
            item.cancel();
        },

        setPriority(priority) {
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

    if (item.timer) {
        clearTimeout(item.timer);
    }

    const task = item.task;
    const taken = item.taken;
    this._removeItem(item);

    // Non blocking call of callback
    // A way to loop through in waiting tasks without blocking
    // semaphore the process until done
    let timerID = setImmediateTick(task);
    item.semaphore = this;
    item.cancel = () => {
        if (timerID) {
            clearImmediateTick(timerID);
            timerID = null;
            this.semGive(taken, true);
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
Semaphore.prototype.destroy = function(safe, onDestroy) {
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

    return this._destroy();
};

Semaphore.prototype._destroy = function() {
    this._destroyWaiting = false;

    // for loop to avoid infinite loop with while
    for (var i = 0, _len = this._queue.length; i < _len; i++) {
        var group = this._queue.beginIterator().value();
        var item = group.stack.beginIterator().value();

        if (item.timer) {
            clearTimeout(item.timer);
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

Semaphore.prototype.schedule = function(collection, priority, iteratee, done) {
    const semID = this;

    switch(arguments.length) {
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

    let count = 0;
    let index = -1;
    const isArray = Array.isArray(collection);
    const keys = isArray ? null : Object.keys(collection);
    const len = isArray ? collection.length : keys.length;

    if (len === 0) {
        done();
        return null;
    }

    const items = new Array(len);
    let doneCalled = false;
    let canceled = false;

    const onTake = (collection, index) => {
        items[index] = null;
        const key = isArray ? index : keys[index];

        let called = false;
        const next = (err) => {
            if (called) {
                throw new Error("callback already called");
            }
            called = true;

            semID.semGive();

            if (doneCalled || canceled) {
                return;
            }

            if (err || ++count === len) {
                doneCalled = true;
                done(err);
            }
        };

        const cancel = typeof iteratee === "function" ? iteratee(collection[key], key, next) : collection[key](next);

        if (typeof cancel === "function") {
            items[index] = {
                cancel
            };
        }
    };

    const iterate = (index) => {
        return semID.semTake({
            priority,
            onTake: onTake.bind(null, collection, index)
        });
    };

    const loop = () => {
        do {
            ++index;
            items[index] = iterate(index);
        } while (index !== len - 1);
    };

    const cancel = () => {
        canceled = true;
        for (let i = 0, len = items.length; i < len; i++) {
            if (items[i] !== null && typeof items[i] === "object" && typeof items[i].cancel === "function") {
                items[i].cancel();
                items[i] = null;
            }
        }
    };

    const setPriority = (priority) => {
        canceled = true;
        for (let i = 0, len = items.length; i < len; i++) {
            if (items[i] !== null && typeof items[i] === "object" && typeof items[i].setPriority === "function") {
                items[i].setPriority(priority);
            }
        }
    };

    loop();

    return {
        setPriority,
        cancel
    };
};

Semaphore.prototype._addItemPriority = function(item) {
    let group = this._queue.get({
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
    this.keepAlive = setTimeout(function() {
        _this._keepAlive();
    }, 1000);
};

/**
 * Remove item from a priority group
 *
 */
Semaphore.prototype._removeItem = function _removeItem(item) {
    item.group.stack.remove(item);
    if (item.group.stack.length === 0) {
        // No more inWaiting for this priority group
        item.semaphore._queue.remove(item.group);

        item.semaphore._checkKeepAlive();
    }

    // Remove properties to allow garbage collector
    // eslint-disable-next-line guard-for-in
    for (var property in item) {
        delete item[property];
    }
};

Semaphore.prototype._addGroup = function _addGroup(item) {

    const stack = new SortedSet({
        comparator: idComparator
    });

    const group = {
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

exports.semCreate = function() {
    const semID = Object.create(Semaphore.prototype);
    Semaphore.apply(semID, arguments);
    return semID;
};

// Allow customization/Patch fix from outside
exports.Semaphore = Semaphore;
