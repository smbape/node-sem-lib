const descendAllTheWay = (leftOrRight, node) => {
    let parent;
    // Assumes node._iteratorParentNode is set
    while (node[leftOrRight] !== null) {
        parent = node;
        node = node[leftOrRight];
        node._iteratorParentNode = parent;
    }
    return node;
};

const moveCursor = (leftOrRight, node) => {
    let parent, rightOrLeft;
    if (node[leftOrRight] !== null) {
        parent = node;
        node = node[leftOrRight];
        node._iteratorParentNode = parent;
        rightOrLeft = leftOrRight === "left" ? "right" : "left";
        node = descendAllTheWay(rightOrLeft, node);
    } else {
        while ((parent = node._iteratorParentNode) !== null && parent[leftOrRight] === node) {
            node = parent;
        }
        node = parent; // either null or the correct-direction parent
    }
    return node;
};

// The BinaryTreeIterator actually writes to the tree: it maintains a
// "_iteratorParentNode" variable on each node. Please ignore this.
class BinaryTreeIterator {
    constructor(tree, node) {
        this.tree = tree;
        this.node = node;
    }

    next() {
        return this.node === null ? null : new BinaryTreeIterator(this.tree, moveCursor("right", this.node));
    }

    previous() {
        if (this.node === null) {
            if (this.tree.root === null) {
                return null;
            }

            this.tree.root._iteratorParentNode = null;
            return new BinaryTreeIterator(this.tree, descendAllTheWay("right", this.tree.root));
        }

        const node = moveCursor("left", this.node);
        return node === null ? null : new BinaryTreeIterator(this.tree, node);
    }

    hasNext() {
        return this.node !== null;
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
        if (!this.hasNext()) {
            throw new Error("Cannot set value at end of set");
        }
        this.node.value = value;
        return value;
    }
}

BinaryTreeIterator.find = (tree, value, comparator) => {
    const {root} = tree;
    if (root != null) {
        root._iteratorParentNode = null;
    }

    let node = root;
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
            node.left._iteratorParentNode = node;
            node = node.left;
        } else if (node.right !== null) {
            node.right._iteratorParentNode = node;
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

    tree.root._iteratorParentNode = null;
    const node = descendAllTheWay("left", tree.root);
    return new BinaryTreeIterator(tree, node);
};

BinaryTreeIterator.right = tree => {
    return new BinaryTreeIterator(tree, null);
};

module.exports = BinaryTreeIterator;
