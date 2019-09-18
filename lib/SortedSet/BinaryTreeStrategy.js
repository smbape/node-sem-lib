const AbstractBinaryTreeStrategy = require("./AbstractBinaryTreeStrategy");
const BinaryTreeNode = require("./BinaryTreeNode");

const nodeAllTheWay = (node, leftOrRight) => {
    while (node[leftOrRight] !== null) {
        node = node[leftOrRight];
    }
    return node;
};

// Returns the subtree, minus value
const binaryTreeDelete = (node, value, comparator) => {
    if (node === null) {
        throw new Error("Value not in set");
    }
    const cmp = comparator(value, node.value);
    if (cmp < 0) {
        node.left = binaryTreeDelete(node.left, value, comparator);
        if (node.left !== null) {
            node.left.parent = node;
        }
    } else if (cmp > 0) {
        node.right = binaryTreeDelete(node.right, value, comparator); // This is the value we want to remove
        if (node.right !== null) {
            node.right.parent = node;
        }
    } else if (node.left === null && node.right === null) {
        node = null;
    } else if (node.right === null) {
        node = node.left;
    } else if (node.left === null) {
        node = node.right;
    } else {
        const nextNode = nodeAllTheWay(node.right, "left");
        node.value = nextNode.value;
        node.right = binaryTreeDelete(node.right, nextNode.value, comparator);
        if (node.right !== null) {
            node.right.parent = node;
        }
    }
    return node;
};

// // Returns the subtree, minus value
// const binaryTreeDelete = (node, value, comparator) => {
//     const stack = [node, value, 0];
//     let pos = stack.length;
//     let ret, cmd, cmp;

//     while (pos !== 0) {
//         cmd = stack[--pos];

//         // eslint-disable-next-line default-case
//         switch(cmd) {
//             case 0:
//                 value = stack[--pos];
//                 node = stack[--pos];

//                 if (node === null) {
//                     throw new Error("Value not in set");
//                 }

//                 cmp = comparator(value, node.value);
//                 if (cmp < 0) {
//                     stack[pos++] = node;
//                     stack[pos++] = 1;
//                     stack[pos++] = node.left;
//                     stack[pos++] = value;
//                     stack[pos++] = 0;
//                     break;
//                 }

//                 if (cmp > 0) {
//                     stack[pos++] = node;
//                     stack[pos++] = 2;
//                     stack[pos++] = node.right;
//                     stack[pos++] = value;
//                     stack[pos++] = 0;
//                     break;
//                 }

//                 if (node.left === null && node.right === null) {
//                     ret = null;
//                 } else if (node.right === null) {
//                     ret = node.left;
//                 } else if (node.left === null) {
//                     ret = node.right;
//                 } else {
//                     value = nodeAllTheWay(node.right, "left").value;
//                     node.value = value;
//                     stack[pos++] = node;
//                     stack[pos++] = 2;
//                     stack[pos++] = node.right;
//                     stack[pos++] = value;
//                     stack[pos++] = 0;
//                 }

//                 break;
//             case 1:
//                 node = stack[--pos];
//                 node.left = ret;
//                 if (node.left !== null) {
//                     node.left.parent = node;
//                 }
//                 ret = node;
//                 break;
//             case 2:
//                 node = stack[--pos];
//                 node.right = ret;
//                 if (node.right !== null) {
//                     node.right.parent = node;
//                 }
//                 ret = node;
//                 break;
//         }
//     }

//     return ret;
// };

module.exports = class BinaryTreeStrategy extends AbstractBinaryTreeStrategy {
    insert(value) {
        if (this.root === null) {
            this.root = new BinaryTreeNode(value);
            return this.root;
        }

        const {comparator: compare} = this;
        let {root: parent} = this;
        let cmp, leftOrRight;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            cmp = compare(value, parent.value);
            if (cmp === 0) {
                throw new Error("Value already in set");
            }

            leftOrRight = cmp < 0 ? "left" : "right";

            if (parent[leftOrRight] === null) {
                parent[leftOrRight] = new BinaryTreeNode(value, parent);
                break;
            }

            parent = parent[leftOrRight];
        }

        return parent[leftOrRight];
    }

    remove(value) {
        this.root = binaryTreeDelete(this.root, value, this.comparator);
        this.root.parent = null;
        return this.root;
    }
};
