/* eslint-env mocha */

const {expect} = require("chai");

const RedBlackTreeStrategy = require("../../../lib/SortedSet/RedBlackTreeStrategy");
const RedBlackTreeNode = require("../../../lib/SortedSet/RedBlackTreeNode");

require("../helpers/StrategyHelper")("Left-leaning red-black tree-based strategy", RedBlackTreeStrategy, {}, true, () => {
    describe("with allowNode", () => {
        let priv;

        const nodes = {};

        const getNode = id => {
            if (!nodes[id]) {
                nodes[id] = new CustomTreeNode(id);
            }
            return nodes[id];
        };

        const idComparator = (a, b) => {
            return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
        };

        class CustomTreeNode extends RedBlackTreeNode {
            constructor(id) {
                super();
                this.id = id;
                this.value = this;
            }
        }

        class CustomTreeStrategy extends RedBlackTreeStrategy {
            insert(id) {
                super.insert(getNode(id));
            }

            remove(id) {
                super.remove(getNode(id));
            }
        }

        const binaryTreeTraverse = node => {
            if (node === null) {
                return;
            }

            const stack = [node.right, node.left];
            let pos = stack.length;

            while (pos !== 0) {
                node = stack[--pos];
                if (node === null) {
                    continue;
                }

                if (node.right) {
                    expect(node.right.parent).to.equal(node);
                }
                if (node.left) {
                    expect(node.left.parent).to.equal(node);
                }

                stack[pos++] = node.right;
                stack[pos++] = node.left;
            }
        };

        beforeEach(() => {
            Object.keys(nodes).reverse().forEach(id => {
                delete nodes[id];
            });

            priv = new CustomTreeStrategy({
                comparator: idComparator,
                allowNode: true
            });
            // Insert in this order so binary tree isn't one-sided
            priv.insert(2);
            priv.insert(1);
            priv.insert(3);
        });

        it("should return a begin iterator", () => {
            const validateIterator = expected => {
                binaryTreeTraverse(priv.root);
                const len = expected.length;
                for (let i = 0, iterator; i < len; i++) {
                    if (i === 0) {
                        iterator = priv.beginIterator();
                        expect(iterator.previous()).to.equal(null);
                    } else {
                        iterator = iterator.next();
                        expect(iterator.previous().value()).to.equal(getNode(expected[i - 1]));
                    }
                    expect(iterator.value()).to.equal(getNode(expected[i]));
                }
            };

            validateIterator([1, 2, 3]);

            priv.insert(4);
            validateIterator([1, 2, 3, 4]);

            priv.insert(5);
            validateIterator([1, 2, 3, 4, 5]);

            priv.insert(6);
            validateIterator([1, 2, 3, 4, 5, 6]);

            priv.insert(7);
            validateIterator([1, 2, 3, 4, 5, 6, 7]);

            priv.insert(8);
            validateIterator([1, 2, 3, 4, 5, 6, 7, 8]);

            priv.remove(2);
            validateIterator([1, 3, 4, 5, 6, 7, 8]);

            priv.insert(9);
            validateIterator([1, 3, 4, 5, 6, 7, 8, 9]);

            priv.remove(7);
            validateIterator([1, 3, 4, 5, 6, 8, 9]);

            priv.insert(10);
            validateIterator([1, 3, 4, 5, 6, 8, 9, 10]);

            priv.remove(8);
            validateIterator([1, 3, 4, 5, 6, 9, 10]);

            priv.insert(11);
            validateIterator([1, 3, 4, 5, 6, 9, 10, 11]);
        });

        it("should step to previous from the end iterator", () => {
            const validateIterator = expected => {
                binaryTreeTraverse(priv.root);
                const len = expected.length;
                for (let i = 0, iterator; i < len; i++) {
                    if (i === 0) {
                        iterator = priv.endIterator().previous();
                    } else {
                        iterator = iterator.previous();
                        expect(iterator.next().value()).to.equal(getNode(expected[len - i]));
                    }
                    expect(iterator.value()).to.equal(getNode(expected[len - 1 - i]));
                }
            };

            validateIterator([1, 2, 3]);

            priv.insert(4);
            validateIterator([1, 2, 3, 4]);

            priv.insert(5);
            validateIterator([1, 2, 3, 4, 5]);

            priv.insert(6);
            validateIterator([1, 2, 3, 4, 5, 6]);

            priv.insert(7);
            validateIterator([1, 2, 3, 4, 5, 6, 7]);

            priv.insert(8);
            validateIterator([1, 2, 3, 4, 5, 6, 7, 8]);

            priv.remove(2);
            validateIterator([1, 3, 4, 5, 6, 7, 8]);

            priv.insert(9);
            validateIterator([1, 3, 4, 5, 6, 7, 8, 9]);

            priv.remove(7);
            validateIterator([1, 3, 4, 5, 6, 8, 9]);

            priv.insert(10);
            validateIterator([1, 3, 4, 5, 6, 8, 9, 10]);

            priv.remove(8);
            validateIterator([1, 3, 4, 5, 6, 9, 10]);

            priv.insert(11);
            validateIterator([1, 3, 4, 5, 6, 9, 10, 11]);
        });
    });
});
