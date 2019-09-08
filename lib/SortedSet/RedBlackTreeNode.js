const BinaryTreeNode = require("./BinaryTreeNode");

// Here are some differences:
// * This isn't a map structure: it's just a tree. There are no keys: the
//   comparator applies to the values.
// * We use the passed comparator.
module.exports = class RedBlackTreeNode extends BinaryTreeNode {
    constructor(value) {
        super(value);
        this.isRed = true; // null nodes -- leaves -- are black
    }
};
