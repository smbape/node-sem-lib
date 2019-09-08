const AbstractBinaryTreeStrategy = require("./AbstractBinaryTreeStrategy");
const RedBlackTreeNode = require("./RedBlackTreeNode");

// An implementation of Left-Leaning Red-Black trees.

// It's copied from http://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf.
// It's practically a copy-paste job, minus the semicolons. missing bits were
// filled in with hints from
// https://www.teachsolaisgames.com/articles/balanced_left_leaning.html

const rotateLeft = node => {
    const tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    tmp.isRed = node.isRed;
    node.isRed = true;
    return tmp;
};

const rotateRight = node => {
    const tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    tmp.isRed = node.isRed;
    node.isRed = true;
    return tmp;
};

const colorFlip = node => {
    node.isRed = !node.isRed;
    node.left.isRed = !node.left.isRed;
    node.right.isRed = !node.right.isRed;
};

const moveRedLeft = node => {
    //throw 'Preconditions failed' if !(!node.left.isRed && !node.left.left?.isRed)
    colorFlip(node);
    if (node.right !== null && node.right.left !== null && node.right.left.isRed) {
        node.right = rotateRight(node.right);
        node = rotateLeft(node);
        colorFlip(node);
    }
    return node;
};

const moveRedRight = node => {
    //throw 'Preconditions failed' if !(!node.right.isRed && !node.right.left?.isRed)
    colorFlip(node);
    if (node.left !== null && node.left.left !== null && node.left.left.isRed) {
        node = rotateRight(node);
        colorFlip(node);
    }
    return node;
};

const insertInNode = (node, value, compare, allowNode) => {
    if (node === null) {
        if (allowNode && value instanceof RedBlackTreeNode) {
            if (!value.isRed) {
                value.isRed = true;
            }
            return value;
        }
        return new RedBlackTreeNode(value);
    }

    //if node.left isnt null && node.left.isRed && node.right isnt null && node.right.isRed
    //  colorFlip(node)
    if (node.value === value) {
        throw new Error("Value already in set");
    }

    if (compare(value, node.value) < 0) {
        node.left = insertInNode(node.left, value, compare, allowNode);
    } else {
        node.right = insertInNode(node.right, value, compare, allowNode);
    }

    if (node.right !== null && node.right.isRed && !(node.left !== null && node.left.isRed)) {
        node = rotateLeft(node);
    }

    if (node.left !== null && node.left.isRed && node.left.left !== null && node.left.left.isRed) {
        node = rotateRight(node);
    }

    // Put this here -- I couldn't get the whole thing to work otherwise :(
    if (node.left !== null && node.left.isRed && node.right !== null && node.right.isRed) {
        colorFlip(node);
    }

    return node;
};

const findMinNode = node => {
    while (node.left !== null) {
        node = node.left;
    }
    return node;
};

const fixUp = node => {
    // Fix right-leaning red nodes
    if (node.right !== null && node.right.isRed) {
        node = rotateLeft(node);
    }

    // Handle a 4-node that traverses down the left
    if (node.left !== null && node.left.isRed && node.left.left !== null && node.left.left.isRed) {
        node = rotateRight(node);
    }

    // split 4-nodes
    if (node.left !== null && node.left.isRed && node.right !== null && node.right.isRed) {
        colorFlip(node);
    }

    return node;
};

const removeMinNode = node => {
    if (node.left === null) {
        return null;
    }
    if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
        node = moveRedLeft(node);
    }
    node.left = removeMinNode(node.left);
    return fixUp(node);
};

// // const removeMinNodeStack = new Array(1024);
// const removeMinNode = node => {
//     let pos = 0;
//     const removeMinNodeStack = [];
//     removeMinNodeStack[pos++] = node;
//     removeMinNodeStack[pos++] = 0;
//     // let stackSize = pos;
//     let ret;

//     while (pos !== 0) {
//         // if (pos > stackSize) {
//         //     stackSize = pos;
//         // }
//         if (removeMinNodeStack[--pos] === 0) {
//             node = removeMinNodeStack[--pos];

//             if (node.left === null) {
//                 ret = null;
//                 continue;
//             }

//             if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
//                 node = moveRedLeft(node);
//             }

//             removeMinNodeStack[pos++] = node;
//             removeMinNodeStack[pos++] = 1;
//             removeMinNodeStack[pos++] = node.left;
//             removeMinNodeStack[pos++] = 0;
//         } else {
//             node = removeMinNodeStack[--pos];
//             node.left = ret;
//             ret = fixUp(node);
//         }
//     }

//     // for (let i = 0; i < stackSize; i++) {
//     //     removeMinNodeStack[i] = undefined;
//     // }

//     return ret;
// };

const removeFromNode = (node, value, compare) => {
    if (node === null) {
        throw new Error("Value not in set");
    }

    if (node.value !== value && compare(value, node.value) < 0) {
        if (node.left === null) {
            throw new Error("Value not in set");
        }
 
        if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
            node = moveRedLeft(node);
        }
 
        node.left = removeFromNode(node.left, value, compare);
    } else {
        if (node.left !== null && node.left.isRed) {
            node = rotateRight(node);
        }
        if (node.right === null) {
            if (value === node.value) {
                return null; // leaf node; LLRB assures no left value here
            }
            throw new Error("Value not in set");
        }
        if (!node.right.isRed && !(node.right.left !== null && node.right.left.isRed)) {
            node = moveRedRight(node);
        }
        if (value === node.value) {
            node.value = findMinNode(node.right).value;
            node.right = removeMinNode(node.right);
        } else {
            node.right = removeFromNode(node.right, value, compare);
        }
    }

    return fixUp(node);
};

// // const removeFromNodeStask = new Array(1024);
// const removeFromNode = (node, value, compare) => {
//     let pos = 0;
//     const removeFromNodeStask = [];
//     removeFromNodeStask[pos++] = node;
//     removeFromNodeStask[pos++] = 0;
//     // let stackSize = pos;
//     let ret, cmd;

//     while (pos !== 0) {
//         // if (pos > stackSize) {
//         //     stackSize = pos;
//         // }
//         cmd = removeFromNodeStask[--pos];

//         // eslint-disable-next-line default-case
//         switch(cmd) {
//             case 0:
//                 node = removeFromNodeStask[--pos];

//                 if (node === null) {
//                     throw new Error("Value not in set");
//                 }

//                 if (node.value !== value && compare(value, node.value) < 0) {
//                     if (node.left === null) {
//                         throw new Error("Value not in set");
//                     }
//                     if (!node.left.isRed && !(node.left.left !== null && node.left.left.isRed)) {
//                         node = moveRedLeft(node);
//                     }
//                     removeFromNodeStask[pos++] = node;
//                     removeFromNodeStask[pos++] = 1;
//                     removeFromNodeStask[pos++] = node.left;
//                     removeFromNodeStask[pos++] = 0;
//                     break;
//                 }

//                 if (node.left !== null && node.left.isRed) {
//                     node = rotateRight(node);
//                 }

//                 if (node.right === null) {
//                     if (value === node.value) {
//                         ret = null; // leaf node; LLRB assures no left value here
//                         break;
//                     }
//                     throw new Error("Value not in set");
//                 }

//                 if (!node.right.isRed && !(node.right.left !== null && node.right.left.isRed)) {
//                     node = moveRedRight(node);
//                 }

//                 if (value === node.value) {
//                     node.value = findMinNode(node.right).value;
//                     node.right = removeMinNode(node.right);
//                     ret = fixUp(node);
//                     break;
//                 }

//                 removeFromNodeStask[pos++] = node;
//                 removeFromNodeStask[pos++] = 2;
//                 removeFromNodeStask[pos++] = node.right;
//                 removeFromNodeStask[pos++] = 0;
//                 break;
//             case 1:
//                 node = removeFromNodeStask[--pos];
//                 node.left = ret;
//                 ret = fixUp(node);
//                 break;
//             case 2:
//                 node = removeFromNodeStask[--pos];
//                 node.right = ret;
//                 ret = fixUp(node);
//                 break;
//         }
//     }

//     // for (let i = 0; i < stackSize; i++) {
//     //     removeFromNodeStask[i] = undefined;
//     // }

//     return ret;
// };

module.exports = class RedBlackTreeStrategy extends AbstractBinaryTreeStrategy {
    insert(value) {
        this.root = insertInNode(this.root, value, this.comparator, this.allowNode);
        this.root.isRed = false; // always
    }

    remove(value) {
        this.root = removeFromNode(this.root, value, this.comparator);
        if (this.root !== null) {
            this.root.isRed = false;
        }
    }
};
