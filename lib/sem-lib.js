const AbstractSortedSet = require("js-sorted-set/src/SortedSet/AbstractSortedSet");
const RedBlackTreeStrategy = require("js-sorted-set/src/SortedSet/RedBlackTreeStrategy");

const hasProp = Object.hasOwnProperty;

const inherits = function(child, parent) {
    for (const key in parent) {
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
};

const isNumeric = obj => {
    if (Array.isArray(obj)) {
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

// Debugging purpose
let globalCounter = 0;

/**
 * Value of parsed interger or default value if not a number or < 0
 * @param  {Any} num value to parse
 * @param  {Interger} _default default value
 * @return {Interger} parsing result
 */
function toInteger(num, positive, _default) {
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
}

/**
 * @constructor
 *
 * @param {Integer} capacity (default = 1) Number of tokens that can be handled by the Semaphore
 * @param {Boolean} isFull (default = false) if true object is created with tokens
 * @param {Integer} priority (default = 15) default priority
 */
function Semaphore(capacity, isFull, priority, sync = false) {
    const _queue = new SortedSet({
        comparator: priorityComparator
    });

    this.id = ++globalCounter;
    this._capacity = toInteger(capacity, true, 1);
    this._queue = _queue;
    this._numTokens = isFull ? this._capacity : 0;
    // eslint-disable-next-line no-magic-numbers
    this.priority = toInteger(priority, false, 15);
    this.sync = sync;
}

Semaphore.prototype.setImmediateTick = (function() {
    if (typeof global === "object" && typeof global.setImmediate === "function") {
        return global.setImmediate;
    }

    return function(fn) {
        return setTimeout(fn, 1);
    };
})();

Semaphore.prototype._clearImmediateTick = (function() {
    if (typeof global === "object" && typeof global.clearImmediate === "function") {
        return global.clearImmediate;
    }

    return function(id) {
        clearTimeout(id);
    };
})();

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
Semaphore.prototype.setCapacity = function getCapacity(capacity) {
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
    let task, timeOut, onTimeOut, onCancel, num, priority, unfair, shouldTakeToken, sync;

    if (this.destroyed) {
        return false;
    }

    if (isObject(options)) {
        task = options.onTake;
        priority = options.priority;
        num = options.num;
        timeOut = options.timeOut;
        onTimeOut = options.onTimeOut;
        onCancel = options.onCancel;
        unfair = options.unfair;
        shouldTakeToken = options.shouldTakeToken;
        sync = options.sync;
    } else if (typeof options === "function") {
        task = options;
        options = {};
    }

    if (typeof task !== "function") {
        task = Function.prototype;
    }

    num = toInteger(num, true, 1);
    priority = toInteger(priority, false, this.priority);

    const item = {
        id: ++globalCounter,
        task,
        priority,
        num,
        onTimeOut,
        onCancel,
        unfair,
        shouldTakeToken,
        sync,
        semaphore: this,
        taken: 0,
        cancel: () => {
            const taken = item.taken;
            this._removeItem(item);

            if (taken !== 0) {
                // give on next tick to wait for all synchronous canceled to be done
                this.setImmediateTick(() => {
                    this.semGive(taken, true);
                });
            }

            if (typeof onCancel === "function") {
                onCancel();
            }
        },
        setPriority: nextPriority => {
            if (item.group == null) {
                return;
            }

            nextPriority = toInteger(nextPriority, false, this.priority);
            if (nextPriority === item.priority) {
                return;
            }

            item.group.stack.remove(item);
            if (item.group.stack.length === 0) {
                // No more inWaiting for this priority group
                item.semaphore._queue.remove(item.group);
            }

            item.priority = nextPriority;
            this._addItemPriority(item);
        }
    };

    this._addItemPriority(item);

    if (isNumeric(timeOut) && timeOut > 0) {
        item.timer = setTimeout(() => {
            const taken = item.taken;
            this._removeItem(item);

            if (taken !== 0) {
                // give on next tick to wait for all synchronous canceled to be done
                this.setImmediateTick(() => {
                    this.semGive(taken, true);
                });
            }

            if (typeof onTimeOut === "function") {
                onTimeOut();
            }
        }, timeOut);
    }

    const res = {
        addCounter(nextNum) {
            item.num += toInteger(nextNum, 1);
        },

        cancel() {
            item.cancel();
        },

        setPriority(nextPriority) {
            item.setPriority(nextPriority);
        }
    };

    const hasResult = isObject(result);

    if (hasResult) {
        result.addCounter = res.addCounter;
        result.cancel = res.cancel;
        result.setPriority = res.setPriority;
    }

    item.disable = () => {
        delete res.addCounter;
        delete res.cancel;
        delete res.setPriority;

        if (hasResult) {
            delete result.addCounter;
            delete result.cancel;
            delete result.setPriority;
        }
    };

    this._semTake();
    return res;
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
        const {disable, taken, task} = item;
        this._removeItem(item);

        if (sync) {
            disable();
            task();
        } else {
            // Non blocking call of callback
            // A way to loop through in waiting tasks without blocking
            // the semaphore process until done
            let timerID = this.setImmediateTick(() => {
                timerID = null;
                disable();
                task();
            });
            item.cancel = () => {
                this._clearImmediateTick(timerID);
                disable();
                timerID = null;

                // give on next tick to wait for all synchronous canceled to be done
                this.setImmediateTick(() => {
                    this.semGive(taken, true);
                });

                const {onCancel} = item;
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

    // for loop to avoid infinite loop with while
    for (let i = 0, _len = this._queue.length; i < _len; i++) {
        const group = this._queue.beginIterator().value();
        const item = group.stack.beginIterator().value();

        if (safe !== false) {
            item.cancel();
        }
        this._removeItem(item);
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
            }: undefined
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
        item.semaphore._queue.remove(item.group);

        item.semaphore._checkKeepAlive();
    }

    // Remove properties to allow garbage collector
    // eslint-disable-next-line guard-for-in
    for (const property in item) {
        if (property !== "id") {
            delete item[property];
        }
    }
};

Semaphore.prototype._addGroup = function _addGroup(item) {
    const stack = new SortedSet({
        comparator: idComparator
    });

    const group = {
        priority: item.priority,
        stack
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
