module.exports = class BinaryTreeNode {
    constructor(value, parent = null) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = parent;
    }
};
