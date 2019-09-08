const BinaryTreeIterator = require("./BinaryTreeIterator");

// const binaryTreeTraverse = (node, callback, some) => {
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
const binaryTreeTraverse = (node, callback, some) => {
    if (node === null) {
        return;
    }

    const stack = [1, node.right, 0, node.value, 1, node.left];
    let pos = stack.length;
    let ret;

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
};

// An AbstractBinaryTreeStrategy has a @root. @root is null or an object with
// `.left`, `.right` and `.value` properties.
module.exports = class AbstractBinaryTreeStrategy {
    constructor(options) {
        this.root = null;
        this.comparator = options.comparator;
        this.allowSetValue = options.allowSetValue;
        this.allowNode = options.allowNode;
    }

    toArray() {
        const ret = [];
        binaryTreeTraverse(this.root, value => {
            ret.push(value);
        });
        return ret;
    }

    forEachImpl(callback, sortedSet, thisArg, some) {
        if (typeof thisArg === "undefined") {
            thisArg = sortedSet;
        }
        let i = 0;
        binaryTreeTraverse(this.root, value => {
            return callback.call(thisArg, value, i++, sortedSet);
        }, some);
    }

    contains(value) {
        const {comparator} = this;
        let {root: node} = this;
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

        return node !== null && node.value === value;
    }

    findIterator(value) {
        return BinaryTreeIterator.find(this, value, this.comparator);
    }

    beginIterator() {
        return BinaryTreeIterator.left(this);
    }

    endIterator() {
        return BinaryTreeIterator.right(this);
    }
};
