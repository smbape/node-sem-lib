const binarySearchForIndex = (array, value, compare) => {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
        mid = low + high >>> 1;
        if (compare(array[mid], value) < 0) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
};

class ArrayIterator {
    constructor(priv, index) {
        this.priv = priv;
        this.index = index;
        this.data = this.priv.data;
    }

    hasNext() {
        return this.index + 1 < this.data.length;
    }

    hasPrevious() {
        return this.index > 0;
    }

    value() {
        if (this.index < this.data.length) {
            return this.data[this.index];
        }
        return null;
    }

    setValue(value) {
        if (!this.priv.allowSetValue) {
            throw new Error("Must set options.allowSetValue");
        }
        if (this.index >= this.data.length) {
            throw new Error("Cannot set value at end of set");
        }
        this.data[this.index] = value;
        return value;
    }

    next() {
        if (this.index + 1 >= this.data.length) {
            return null;
        }
        return new ArrayIterator(this.priv, this.index + 1);
    }

    previous() {
        if (this.index <= 0) {
            return null;
        }
        return new ArrayIterator(this.priv, this.index - 1);
    }
}

module.exports = class ArrayStrategy {
    constructor(options) {
        this.comparator = options.comparator;
        this.allowSetValue = options.allowSetValue;
        this.data = [];
    }

    toArray() {
        return this.data;
    }

    insert(value) {
        const index = binarySearchForIndex(this.data, value, this.comparator);
        if (this.data[index] === value) {
            throw new Error("Value already in set");
        }
        return this.data.splice(index, 0, value);
    }

    remove(value) {
        const index = binarySearchForIndex(this.data, value, this.comparator);
        if (this.data[index] !== value) {
            throw new Error("Value not in set");
        }
        return this.data.splice(index, 1);
    }

    contains(value) {
        const index = binarySearchForIndex(this.data, value, this.comparator);
        return this.index !== this.data.length && this.data[index] === value;
    }

    forEachImpl(callback, sortedSet, thisArg, some) {
        if (typeof thisArg === "undefined") {
            thisArg = sortedSet;
        }

        for (let i = 0, len = this.data.length, res; i < len; i++) {
            res = callback.call(thisArg, this.data[i], i, sortedSet);
            if (some && res) {
                break;
            }
        }
    }

    findIterator(value) {
        const index = binarySearchForIndex(this.data, value, this.comparator);
        return new ArrayIterator(this, index);
    }

    beginIterator() {
        return new ArrayIterator(this, 0);
    }

    endIterator() {
        return new ArrayIterator(this, this.data.length);
    }
};
