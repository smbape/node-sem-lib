const descendAllTheWay = (leftOrRight, node) => {
    while (node[leftOrRight] !== null) {
        node = node[leftOrRight];
    }
    return node;
};

const moveCursor = (leftOrRight, node) => {
    let parent, rightOrLeft;
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
};

// The BinaryTreeIterator actually writes to the tree: it maintains a
// "parent" variable on each node. Please ignore this.
class BinaryTreeIterator {
    constructor(tree, node) {
        this.tree = tree;
        this.node = node;
    }

    next() {
        if (this.node === null) {
            return null;
        }
        const node = moveCursor("right", this.node);
        return node === null ? null : new BinaryTreeIterator(this.tree, node);
    }

    previous() {
        if (this.node === null) {
            if (this.tree.root === null) {
                return null;
            }

            const node = descendAllTheWay("right", this.tree.root);
            return node === null ? null : new BinaryTreeIterator(this.tree, node);
        }

        const node = moveCursor("left", this.node);
        return node === null ? null : new BinaryTreeIterator(this.tree, node);
    }

    hasNext() {
        return this.next() !== null;
    }

    hasPrevious() {
        return this.previous() !== null;
    }

    value() {
        return this.node === null ? null : this.node.value;
    }

    setValue(value) {
        if (!this.tree.allowSetValue) {
            throw new Error("Must set options.allowSetValue");
        }
        if (this.node === null) {
            throw new Error("Cannot set value at end of set");
        }
        this.node.value = value;
        return value;
    }
}

BinaryTreeIterator.find = (tree, value, comparator) => {
    let {root: node} = tree;
    let nextNode = null; // For finding an in-between node
    let cmp;

    while (node !== null) {
        cmp = comparator(value, node.value);
        if (cmp === 0) {
            break;
        }

        if (cmp < 0) {
            if (node.left === null) {
                break;
            }

            // If we descend all right after this until there are
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

BinaryTreeIterator.left = tree => {
    if (tree.root === null) {
        return new BinaryTreeIterator(tree, null);
    }

    const node = descendAllTheWay("left", tree.root);
    return new BinaryTreeIterator(tree, node);
};

BinaryTreeIterator.right = tree => {
    return new BinaryTreeIterator(tree, null);
};

module.exports = BinaryTreeIterator;
