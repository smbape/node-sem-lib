/* eslint-env mocha */
/* eslint-disable no-magic-numbers */

const {expect} = require("chai");
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));

const numberComparator = (a, b) => {
    return a - b;
};

module.exports = (description, Strategy, options, checkParent, cb) => {
    describe(description, () => {
        let priv;
        describe("starting empty", () => {
            beforeEach(() => {
                priv = new Strategy({
                    comparator: numberComparator
                });
            });

            it("should not contain a value", () => {
                expect(priv.contains(2)).to.eq(false);
            });

            it("should store its data in an array for easy testing", () => {
                expect(priv.toArray()).to.deep.eq([]);
            });

            it("should insert an element", () => {
                priv.insert(4);
                expect(priv.toArray()).to.deep.eq([4]);
            });

            it("should fail to remove an element", () => {
                expect(() => {
                    priv.remove(4);
                }).to.throw("Value not in set");
            });

            it("should return an iterator with no next or previous", () => {
                const iterator = priv.findIterator(4);
                expect(iterator.hasNext()).to.eq(false);
                expect(iterator.hasPrevious()).to.eq(false);
                expect(iterator.next()).to.eq(null);
                expect(iterator.previous()).to.eq(null);
                expect(iterator.value()).to.eq(null);
            });

            it("should return a beginIterator", () => {
                const iterator = priv.beginIterator();
                expect(iterator.value()).to.eq(null);
            });

            it("should return an endIterator", () => {
                const iterator = priv.endIterator();
                expect(iterator.value()).to.eq(null);
            });

            it("should do nothing in forEachImpl()", () => {
                const callback = sinon.spy();
                priv.forEachImpl(callback);
                expect(callback).not.to.have.been.called; // eslint-disable-line no-unused-expressions
            });
        });
        describe("with some numbers", () => {
            beforeEach(() => {
                priv = new Strategy({
                    comparator: numberComparator
                });
                // Insert in this order so binary tree isn't one-sided
                priv.insert(2);
                priv.insert(1);
                priv.insert(3);
            });

            it("should insert at the beginning", () => {
                priv.insert(0);
                expect(priv.toArray()).to.deep.eq([0, 1, 2, 3]);
            });

            it("should insert in the middle", () => {
                priv.insert(2.5);
                expect(priv.toArray()).to.deep.eq([1, 2, 2.5, 3]);
            });

            it("should insert at the end", () => {
                priv.insert(4);
                expect(priv.toArray()).to.deep.eq([1, 2, 3, 4]);
            });

            it("should remove from the beginning", () => {
                priv.remove(1);
                expect(priv.toArray()).to.deep.eq([2, 3]);
            });

            it("should remove from the end", () => {
                priv.remove(3);
                expect(priv.toArray()).to.deep.eq([1, 2]);
            });

            it("should remove from the middle", () => {
                priv.remove(2);
                expect(priv.toArray()).to.deep.eq([1, 3]);
            });

            it("should contain the first value", () => {
                expect(priv.contains(1)).to.eq(true);
            });

            it("should contain the last value", () => {
                expect(priv.contains(3)).to.eq(true);
            });

            it("should contain a middle value", () => {
                expect(priv.contains(2)).to.eq(true);
            });

            it("should not contain a value below the lowest", () => {
                expect(priv.contains(0)).to.eq(false);
            });

            it("should not contain a value above the highest", () => {
                expect(priv.contains(4)).to.eq(false);
            });

            it("should not contain a value in between two values", () => {
                expect(priv.contains(1.5)).to.eq(false);
            });

            it("should return false from contain", () => {
                expect(priv.contains(4)).to.eq(false);
            });

            it("should return a begin iterator", () => {
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

                const validateIterator = expected => {
                    if (checkParent) {
                        binaryTreeTraverse(priv.root);
                    }
                    const len = expected.length;
                    for (let i = 0, iterator; i < len; i++) {
                        if (i === 0) {
                            iterator = priv.beginIterator();
                            expect(iterator.previous()).to.eq(null);
                        } else {
                            iterator = iterator.next();
                            expect(iterator.previous().value()).to.eq(expected[i - 1]);
                        }
                        expect(iterator.value()).to.eq(expected[i]);
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

            it("should return an end iterator", () => {
                const iterator = priv.endIterator();
                expect(iterator.next()).to.eq(null);
                expect(iterator.value()).to.eq(null);
            });

            it("should find an iterator", () => {
                const iterator = priv.findIterator(2);
                expect(iterator.value()).to.eq(2);
            });

            it("should find an iterator between values", () => {
                const iterator = priv.findIterator(1.5);
                expect(iterator.value()).to.eq(2);
            });

            it("should find an iterator with a value above the max", () => {
                const iterator = priv.findIterator(3.5);
                expect(iterator.value()).to.eq(null);
            });

            it("should find an iterator with a value below the min", () => {
                const iterator = priv.findIterator(0.5);
                expect(iterator.value()).to.eq(1);
            });

            it("should find a previous iterator", () => {
                const iterator = priv.findIterator(2).previous();
                expect(iterator.value()).to.eq(1);
            });

            it("should find a next iterator", () => {
                const iterator = priv.findIterator(2).next();
                expect(iterator.value()).to.eq(3);
            });

            it("should step to previous from the end iterator", () => {
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

                const validateIterator = expected => {
                    if (checkParent) {
                        binaryTreeTraverse(priv.root);
                    }
                    const len = expected.length;
                    for (let i = 0, iterator; i < len; i++) {
                        if (i === 0) {
                            iterator = priv.endIterator().previous();
                        } else {
                            iterator = iterator.previous();
                            expect(iterator.next().value()).to.eq(expected[len - i]);
                        }
                        expect(iterator.value()).to.eq(expected[len - 1 - i]);
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

            it("should step to end from a previous iterator", () => {
                const iterator = priv.findIterator(3).next();
                expect(iterator).to.eq(null);
            });

            it("should fail to setValue()", () => {
                const iterator = priv.findIterator(2);
                expect(() => {
                    iterator.setValue(2.5);
                }).to.throw();
            });

            it("should iterate in forEachImpl", () => {
                const set = "foo";
                const thisArg = "moo";
                const spy = sinon.spy();
                priv.forEachImpl(spy, set, thisArg);
                expect(spy).to.have.callCount(3);
                expect(spy.thisValues[0]).to.eq(thisArg);
                expect(spy.args[0]).to.deep.eq([1, 0, set]);
                expect(spy.args[1]).to.deep.eq([2, 1, set]);
                expect(spy.args[2]).to.deep.eq([3, 2, set]);
            });
        });

        describe("with allowSetValue", () => {
            beforeEach(() => {
                priv = new Strategy({
                    comparator: numberComparator,
                    allowSetValue: true
                });
                priv.insert(1);
                priv.insert(2);
            });

            it("should allow you to use setValue(), even to do something stupid", () => {
                const iterator = priv.findIterator(2);
                iterator.setValue(0);
                expect(priv.toArray()).to.deep.eq([1, 0]);
            });

            it("should not allow setValue() on an end iterator", () => {
                const iterator = priv.endIterator();
                expect(() => {
                    iterator.setValue(2.5);
                }).to.throw();
            });
        });

        if (typeof cb === "function") {
            cb();
        }
    });
};
