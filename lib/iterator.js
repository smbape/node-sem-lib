const createArrayIterator = arr => {
    let i = 0;
    const len = arr.length;

    return function next() {
        return i < len ? {
            key: i,
            value: arr[i++],
        } : null;
    };
};

const createObjectIterator = obj => {
    let i = 0;
    const keys = Object.keys(obj);
    const len = keys.length;

    return function next() {
        return i < len ? {
            key: keys[i],
            value: obj[keys[i++]]
        } : null;
    };
};

const createIterableIterator = iterable => {
    const iterator = iterable[Symbol.iterator]();
    return function next() {
        const item = iterator.next();
        return item === null || typeof item !== "object" ? item : item.done ? null : item;
    };
};

const iterator = obj => {
    if (obj === null || typeof obj !== "object") {
        return null;
    }

    return Array.isArray(obj) ? createArrayIterator(obj) : Symbol.iterator in obj ? createIterableIterator(obj) : createObjectIterator(obj);
};

module.exports = iterator;
