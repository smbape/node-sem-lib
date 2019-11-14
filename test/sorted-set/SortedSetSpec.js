/* eslint-env mocha */

const {expect} = require("chai");
const AbstractSortedSet = require("../../lib/SortedSet/AbstractSortedSet");
const ArrayStrategy = require("../../lib/SortedSet/ArrayStrategy");
const BinaryTreeStrategy = require("../../lib/SortedSet/BinaryTreeStrategy");
const RedBlackTreeStrategy = require("../../lib/SortedSet/RedBlackTreeStrategy");

const numberCompare = (a, b) => {
    return a - b;
};

const defaultComparator = (a, b) => {
    return (a || 0) - (b || 0);
};

class SortedSet extends AbstractSortedSet {
    constructor(options) {
        super(Object.assign({
            strategy: RedBlackTreeStrategy,
            comparator: defaultComparator
        }, options));
    }
}

describe("SortedSet", () => {
    it("should have a RedBlackTreeStrategy", () => {
        expect(RedBlackTreeStrategy).to.exist;
    });

    it("should have a BinaryTreeStrategy", () => {
        expect(BinaryTreeStrategy).to.exist;
    });

    it("should have an ArrayStrategy", () => {
        expect(ArrayStrategy).to.exist;
    });

    it("should default to RedBlackTreeStrategy", () => {
        const set = new SortedSet({
            comparator: numberCompare
        });
        expect(set.priv.constructor).to.eq(RedBlackTreeStrategy);
    });

    it("should set a default comparator", () => {
        const set = new SortedSet({
            strategy: RedBlackTreeStrategy
        });
        expect(set.priv.comparator(2, 3)).to.eq(-1);
    });
});

describe("integration tests", () => {
    let set;
    beforeEach(() => {
        set = new SortedSet();
    });

    it("should stay sorted", () => {
        set.insert(1);
        set.insert(3);
        set.insert(2);
        expect(set.toArray()).to.deep.eq([1, 2, 3]);
    });

    it("should remove", () => {
        set.insert(1);
        set.insert(2);
        set.remove(2);
        expect(set.toArray()).to.deep.eq([1]);
    });

    it("should map", () => {
        set.insert(1);
        set.insert(2);
        expect(set.map(v => {
            return v * 2;
        })).to.deep.eq([2, 4]);
    });
    
    it("should iterate", () => {
        let iterator;
        set.insert(1);
        set.insert(2);
        iterator = set.beginIterator();
        expect(iterator.value()).to.eq(1);
        iterator = iterator.next();
        expect(iterator.value()).to.eq(2);
        iterator = iterator.next();
        expect(iterator).to.eq(null);
    });
});
