const AbstractSortedSet = require("./SortedSet/AbstractSortedSet");
const RedBlackTreeStrategy = require("./SortedSet/RedBlackTreeStrategy");
const createIterator = require("./iterator");
const isNumeric = require("./isNumeric");
const toInteger = require("./toInteger");
const Inwaiting = require("./Inwaiting");

const isObject = obj => {
    return typeof obj === "object" && obj !== null;
};

const idComparator = (a, b) => {
    return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
};

const priorityComparator = (a, b) => {
    return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
};

const onlyOnce = fn => {
    return function() {
        if (fn === null) {
            throw new Error("Callback was already called.");
        }

        const callFn = fn;
        fn = null;
        callFn.apply(null, arguments);
    };
};

const {hasOwnProperty: hasProp} = Object;

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
        const [group, item] = this._nextGroupItem();
        if (item == null) {
            break;
        }

        let weakerIterator, weakeGroup, weakerItemIterator, weakerItem;

        // if item is still waiting for tokens
        if (item.num > this._numTokens) {
            item.taken += this._numTokens;
            item.num -= this._numTokens;
            this._numTokens = 0;

            // take token from tasks with weaker priority
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
                            const taken = item.num > weakerItem.taken ? weakerItem.taken : item.num;
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
            }

            // if item is still waiting for tokens, try again at next give or flush
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

Semaphore.prototype._runTask = function(item, topSync) {
    const sync = typeof topSync !== "undefined" ? topSync : typeof item.sync !== "undefined" ? item.sync : this.sync;
    const {taken, task, onCancel, hasNext} = item;

    if (sync) {
        if (!hasNext || typeof hasNext !== "function" || !hasNext.call(item)) {
            this._removeItem(item);

            // Prevent usage of cancel
            item.cancel = undefined;
        }
        task();
        return;
    }

    // Non blocking call of callback
    // A way to loop through in waiting tasks without blocking
    // the semaphore process until done
    let timerID = this._setImmediate(() => {
        timerID = null;
        task();
    });

    item.cancel = () => {
        // Prevent usage of cancel
        item.cancel = undefined;

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

    // call hasNext after cancel is set to allow hasNext
    if (!hasNext || typeof hasNext !== "function" || !hasNext.call(item)) {
        this._removeItem(item);
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

    const iterator = createIterator(collection);
    if (iterator === null) {
        callback();
        return null;
    }

    callback = onlyOnce(callback);

    const cancellers = [];
    const errors = [];
    const items = [];
    let item;
    let waiting = 0;
    let canceled = false;
    let done = false;
    let loops = 0;
    let hasError = false;

    const hasNext = () => {
        if (done) {
            return false;
        }

        const nextItem = iterator();

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

    const replenish = () => {
        if (loops++ !== 0) {
            return;
        }

        for (; loops > 0; loops--) {
            if (!canceled && --waiting === 0 && done) {
                callback(errors.length === 0 ? undefined : errors);
            }
            this.semGive();
        }
    };

    const onTake = () => {
        if (hasError || items.length === item.scheduled) {
            replenish();
            return;
        }

        const i = item.scheduled;
        const nextItem = items[i];
        cancellers[i] = null;
        item.scheduled++;

        const give = err => {
            nextItem.done = true;

            cancellers[i] = undefined;

            if (err) {
                hasError = true;
                errors[i] = err;
                nextItem.error = err;
            }

            replenish();
        };

        const {key, value} = nextItem;
        nextItem.done = false;
        nextItem.iteratee = typeof iteratee === "function" ? iteratee : value;
        const icancel = typeof iteratee === "function" ? iteratee(value, key, give) : value(give);

        if (cancellers[i] !== undefined && icancel) {
            cancellers[i] = () => {
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

    const onCancel = () => {
        canceled = true;

        if (!done) {
            this._removeItem(item); // remove item since there is no more token needed and _semTake will not remove it
        }

        cancellers.forEach(cancel => {
            if (typeof cancel === "function") {
                cancel();
            }
        });

        const err = new Error("canceled");
        err.code = "CANCELED";
        callback(err);
    };

    waiting++;
    item = this.semTake({
        priority,
        onTake,
        hasNext,
    }, _item => {
        item = _item;
        item.scheduled = 0;
    });

    if (waiting === 0) {
        return item;
    }

    return new Proxy(item, {
        get(target, prop, receiver) {
            if (prop === "cancel") {
                return waiting === 0 || canceled ? undefined : onCancel;
            }

            if (prop === "setPriority") {
                return target.setPriority.bind(target);
            }

            if (prop === "scheduled") {
                return Reflect.get(...arguments);
            }

            return undefined;
        }
    });
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

    let group, itemIterator, item;
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

    item.destroy();
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

module.exports = Semaphore;
