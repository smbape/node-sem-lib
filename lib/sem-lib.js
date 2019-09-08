const AbstractSortedSet = require("./SortedSet/AbstractSortedSet");
const RedBlackTreeNode = require("./SortedSet/RedBlackTreeNode");
const RedBlackTreeStrategy = require("./SortedSet/RedBlackTreeStrategy");

const isNumeric = obj => {
    if (obj === undefined || obj === null || Array.isArray(obj)) {
        return false;
    }

    const parsed = parseFloat(obj);
    if (obj === parsed) {
        return true;
    }

    return obj - parsed + 1 >= 0;
};

const isObject = obj => {
    return typeof obj === "object" && obj !== null;
};

/**
 * Value of parsed interger or default value if not a number or < 0
 * @param  {Any} num value to parse
 * @param  {Interger} _default default value
 * @return {Interger} parsing result
 */
const toInteger = (num, positive, _default) => {
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

const idComparator = (a, b) => {
    return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
};

const priorityComparator = (a, b) => {
    return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
};

const hasProp = Object.hasOwnProperty;

// Debugging purpose
let globalCounter = 0;

class SortedSet extends AbstractSortedSet {
    get(value) {
        const {comparator} = this.priv;
        let {root: node} = this.priv;
        let cmp;

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
}

class Inwaiting extends RedBlackTreeNode {
    constructor(semID, task, priority, num, options) {
        super();
        this.value = this;
        this.id = ++globalCounter;
        this.taken = 0;
        this.task = task;
        this.priority = priority;
        this.num = num;
        this.semaphore = semID;

        if (options) {
            [
                "onTimeOut",
                "onCancel",
                "unfair",
                "shouldTakeToken",
                "sync"
            ].forEach(prop => {
                if (hasProp.call(options, prop)) {
                    this[prop] = options[prop];
                }
            });
        }
    }

    addCounter(nextNum) {
        this.num += toInteger(nextNum, true, 1);
    }

    cancel() {
        const {onCancel, taken, semaphore: semID} = this;
        semID._removeItem(this);

        if (taken !== 0) {
            // give on next tick to wait for all synchronous canceled to be done
            semID._setImmediate(() => {
                semID.semGive(taken, true);
            });
        }

        if (typeof onCancel === "function") {
            onCancel();
        }
    }

    setPriority(nextPriority) {
        if (this.group == null) {
            return;
        }

        const {semaphore: semID} = this;

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
}

/**
 * @param  {Integer} capacity (default = 1) Number of tokens that can be handled by the Semaphore
 * @param  {Boolean} isFull   (default = false) if true object is created with tokens
 * @param  {Integer} priority (default = 15) default priority
 * @param  {Boolean} sync     if true tasks will be run synchronously
 */
function Semaphore(capacity, isFull, priority, sync = false) {
    const _queue = new SortedSet({
        comparator: priorityComparator,
        strategy: RedBlackTreeStrategy
    });

    this.id = ++globalCounter;
    this._capacity = toInteger(capacity, true, 1);
    this._queue = _queue;
    this._numTokens = isFull ? this._capacity : 0;
    // eslint-disable-next-line no-magic-numbers
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
    this._queue.forEach(group => {
        group.stack.forEach(item => {
            item.num = 0;
        });
    });
    this._semTake();
    return true;
};

Semaphore.prototype.handleTimeout = function handleTimeout(item) {
    const {onTimeOut, taken} = item;
    this._removeItem(item);

    if (taken !== 0) {
        // give on next tick to wait for all synchronous canceled to be done
        this._setImmediate(() => {
            this.semGive(taken, true);
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

    const hasOptions = isObject(options);
    let task, timeOut, num, priority;

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

    const item = new Inwaiting(this, task, priority, num, hasOptions ? options : false);

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
    let groupIterator, group, itemIterator, item;

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
    if (this.taking) {
        return;
    }

    if (typeof this.keepAlive === "undefined") {
        this._keepAlive();
    }

    this.taking = true;
    while (this._checkKeepAlive(this._destroyWaiting)) {
        const [group, item] = this._nextGroupItem();
        if (item == null) {
            break;
        }

        let weakerIterator, wearkeGroup, weakerItemIterator, weakerItem;

        // if item is still waiting for tokens
        if (item.num > this._numTokens) {
            item.taken += this._numTokens;
            item.num -= this._numTokens;
            this._numTokens = 0;

            // take token from tasks with weaker priority
            if (item.unfair && this._queue.length !== 1) {
                weakerIterator = this._queue.endIterator().previous();

                while (weakerIterator && item.num !== 0) {
                    wearkeGroup = weakerIterator.value();
                    if (wearkeGroup === group || wearkeGroup.priority <= this.priority) {
                        // can only be unfair on tasks with lower priority that semaphore default priority
                        break;
                    }

                    weakerItemIterator = wearkeGroup.stack.endIterator().previous();
                    weakerItem = weakerItemIterator ? weakerItemIterator.value() : null;

                    while (weakerItem && item.num !== 0) {
                        if (weakerItem.taken > 0 && this._shouldTakeToken(item, Math.min(item.num, weakerItem.taken))) {
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

                        weakerItemIterator = weakerItemIterator.hasPrevious() && weakerItemIterator.previous();
                        weakerItem = weakerItemIterator ? weakerItemIterator.value() : null;
                    }

                    weakerIterator = weakerIterator.hasPrevious() && weakerIterator.previous();
                }
            }

            // if item is still waiting for tokens, try again at next give or flush
            if (item.num !== 0) {
                break;
            }
        }

        item.taken += item.num;
        if (this._numTokens !== Number.POSITIVE_INFINITY) {
            this._numTokens -= item.num;
        }
        item.num = 0;

        const sync = typeof topSync !== "undefined" ? topSync : typeof item.sync !== "undefined" ? item.sync : this.sync;
        const {taken, task, onCancel} = item;
        this._removeItem(item);

        if (sync) {
            task();
        } else {
            // Non blocking call of callback
            // A way to loop through in waiting tasks without blocking
            // the semaphore process until done
            let timerID = this._setImmediate(() => {
                timerID = null;
                task();
            });
            item.cancel = () => {
                this._clearImmediate(timerID);
                timerID = null;

                // give on next tick to wait for all synchronous canceled to be done
                this._setImmediate(() => {
                    this.semGive(taken, true);
                });

                if (typeof onCancel === "function") {
                    onCancel();
                }
            };
        }
    }
    this.taking = false;
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

    return this._destroy(safe);
};

Semaphore.prototype._destroy = function(safe) {
    this._destroyWaiting = false;

    let i, _len, j, _jlen;

    // for loop to avoid infinite loop with while
    for (i = 0, _len = this._queue.length; i < _len; i++) {
        const group = this._queue.beginIterator().value();

        for (j = 0, _jlen = group.stack.length; j < _jlen; j++) {
            const item = group.stack.beginIterator().value();
            if (safe !== false) {
                item.cancel();
            }
            this._removeItem(item);
        }
    }

    if (this._checkKeepAlive()) {
        return false;
    }

    const __onDestroy = this.__onDestroy;

    this.destroyed = true;
    if ("function" === typeof __onDestroy) {
        __onDestroy();
    }
    return true;
};

Semaphore.prototype.schedule = function(collection, priority, iteratee, callback) {
    const semID = this;

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
        default:
            // Nothing to do
    }

    if (callback == null) {
        callback = Function.prototype;
    }

    let count = 0;
    let index = -1;
    const isArray = Array.isArray(collection);
    const keys = isArray ? null : Object.keys(collection);
    const len = isArray ? collection.length : keys.length;

    if (len === 0) {
        callback();
        return null;
    }

    const items = new Array(len);
    let doneCalled = false;
    let canceled = false;
    let taken = 0;
    const errors = new Array(len);
    let hasError = false;

    const onTake = (coll, i) => {
        taken++;
        items[i] = null;
        const key = isArray ? i : keys[i];

        let called = false;
        const next = err => {
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

        const icancel = typeof iteratee === "function" ? iteratee(coll[key], key, next) : coll[key](next);

        items[i] = {
            cancel: () => {
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

    const iterate = i => {
        const item = semID.semTake({
            priority,
            onTake: onTake.bind(null, collection, i)
        });

        const proxy = {
            cancel: item.cancel ? () => {
                item.cancel();
                onTake(collection, i);
            } : undefined
        };

        for (const key in item) {
            if (key === "cancel") {
                continue;
            }

            Object.defineProperty(proxy, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return item[key];
                },
                set(value) {
                    item[key] = value;
                    return value;
                }
            });
        }

        return proxy;
    };

    const loop = () => {
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
        for (let i = 0, size = items.length; i < size; i++) {
            if (items[i] !== null && typeof items[i] === "object" && typeof items[i].cancel === "function") {
                items[i].cancel();
                items[i] = null;
            }
        }
    }

    const setPriority = nextPriority => {
        for (let i = 0, size = items.length; i < size; i++) {
            if (items[i] !== null && typeof items[i] === "object" && typeof items[i].setPriority === "function") {
                items[i].setPriority(nextPriority);
            }
        }
    };

    loop();

    return {
        setPriority,
        cancel
    };
};

Semaphore.prototype._insertItem = function(item) {
    let group = this._queue.get({
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
    let count = 0;

    if (!this.hasInWaitingTask()) {
        return count;
    }

    let iterator = this._queue.beginIterator();

    let group, itemerator, item;
    while (iterator) {
        group = iterator.value();

        if (group != null && group.stack.length !== 0) {
            itemerator = group.stack.beginIterator();

            while (itemerator) {
                item = itemerator.value();
                if (item != null) {
                    count += item.num;
                }
                itemerator = itemerator.hasNext() && itemerator.next();
            }
        }

        iterator = iterator.hasNext() && iterator.next();
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
    const _this = this;
    this.keepAlive = setTimeout(() => {
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

    // Remove properties to allow garbage collection
    Object.keys(item).forEach(prop => {
        if (prop !== "id") {
            // delete is more cpu expensive
            item[prop] = undefined;
        }
    });
};

Semaphore.prototype._insertGroup = function _insertGroup(item) {
    const stack = new SortedSet({
        comparator: idComparator,
        strategy: RedBlackTreeStrategy,
        allowNode: true
    });

    const group = {
        priority: item.priority,
        stack
    };
    this._queue.insert(group);
    return group;
};

Semaphore.prototype._setImmediate = (() => {
    if (typeof global === "object" && typeof global.setImmediate === "function") {
        return global.setImmediate;
    }

    return fn => {
        return setTimeout(fn, 1);
    };
})();

Semaphore.prototype._clearImmediate = (() => {
    if (typeof global === "object" && typeof global.clearImmediate === "function") {
        return global.clearImmediate;
    }

    return id => {
        clearTimeout(id);
    };
})();

exports.semCreate = (...args) => {
    return new Semaphore(...args);
};

// Allow customization/Patch fix from outside
exports.Semaphore = Semaphore;
