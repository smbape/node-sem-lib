/* global describe:false, it:false, assert:false, expect:false */
/* eslint-disable no-magic-numbers */

const semLib = require("../");

describe("schedule", function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(300 * 1000);
    const ms = Math.pow(2, 5);
    const hasProp = Object.prototype.hasOwnProperty;

    function actualPush(actual, count, timerDiff) {
        const key = "t" + Math.round( timerDiff / ms );
        if (!hasProp.call(actual, key)) {
            actual[key] = [];
        }
        actual[key].push(count);
    }

    function assertSchedule(actual, expected) {
        expect(Object.keys(actual)).to.deep.equal(Object.keys(expected));
        // eslint-disable-next-line guard-for-in
        for (const key in actual) {
            expect(actual[key].sort()).to.deep.equal(expected[key].sort());
        }
    }

    it("should schedule array", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms)
        ], () => {
            const expected = {};
            expected.t1 = [2, 3];
            expected.t2 = [1, 4, 5];
            expected.t3 = [6];

            assertSchedule(actual, expected);
            done();
        });

        const timerInit = new Date().getTime();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(count, timeout) {
            return (next) => {
                setTimeout(() => {
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule array with iteratee", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        semID.schedule([
            [++count, 2 * ms],
            [++count, ms],
            [++count, ms],
            [++count, ms],
            [++count, ms],
            [++count, ms]
        ], (args, key, next) => {
            return schedule.apply(null, args)(next);
        }, () => {
            const expected = {};
            expected.t1 = [2, 3];
            expected.t2 = [1, 4, 5];
            expected.t3 = [6];

            assertSchedule(actual, expected);
            done();
        });

        const timerInit = new Date().getTime();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(count, timeout) {
            return (next) => {
                setTimeout(() => {
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule object", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        semID.schedule({
            s1: schedule(++count, 2 * ms),
            s2: schedule(++count, ms),
            s3: schedule(++count, ms),
            s4: schedule(++count, ms),
            s5: schedule(++count, ms),
            s6: schedule(++count, ms)
        }, () => {
            const expected = {};
            expected.t1 = [2, 3];
            expected.t2 = [1, 4, 5];
            expected.t3 = [6];

            assertSchedule(actual, expected);
            done();
        });

        const timerInit = new Date().getTime();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(count, timeout) {
            return (next) => {
                setTimeout(() => {
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule object with iteratee", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        semID.schedule({
            s1: [++count, 2 * ms],
            s2: [++count, ms],
            s3: [++count, ms],
            s4: [++count, ms],
            s5: [++count, ms],
            s6: [++count, ms]
        }, (args, key, next) => {
            return schedule.apply(null, args)(next);
        }, () => {
            const expected = {};
            expected.t1 = [2, 3];
            expected.t2 = [1, 4, 5];
            expected.t3 = [6];

            assertSchedule(actual, expected);
            done();
        });

        const timerInit = new Date().getTime();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(count, timeout) {
            return (next) => {
                setTimeout(() => {
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should cancel schedule before start", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms)
        ]);

        const timerInit = new Date().getTime();
        assert.strictEqual(waiting, 0);
        assert.strictEqual(semID.getNumTokens(), 0);
        item.cancel();
        assert.strictEqual(waiting, 0);
        assert.strictEqual(semID.getNumTokens(), 3);

        setTimeout(() => {
            const expected = {};
            assert.strictEqual(waiting, 0);
            assertSchedule(actual, expected);
            done();
        }, 3.2 * ms);

        function schedule(count, timeout) {
            return (next) => {
                waiting++;
                setTimeout(() => {
                    waiting--;
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should cancel schedule after callback and before done", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms)
        ]);

        const timerInit = new Date().getTime();
        assert.strictEqual(semID.getNumTokens(), 0);

        setTimeout(() => {
            item.cancel();
            assert.strictEqual(waiting, 3);
            assert.strictEqual(semID.getNumTokens(), 3);
        }, ms / 2);

        setTimeout(() => {
            const expected = {};
            assertSchedule(actual, expected);
            done();
        }, 3.2 * ms);

        function schedule(count, timeout) {
            return (next) => {
                waiting++;
                const timerID = setTimeout(() => {
                    waiting--;
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);

                return () => {
                    // should be synchronous
                    clearTimeout(timerID);
                    next();
                };
            };
        }
    });

    it("should change priority on the fly", (done) => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;

        semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms)
        ], 15);

        const group2 = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms)
        ], 15);

        const timerInit = new Date().getTime();
        assert.strictEqual(semID.getNumTokens(), 0);

        setTimeout(() => {
            group2.setPriority(14);
            assert.strictEqual(waiting, 3);
            assert.strictEqual(semID.getNumTokens(), 0);
        }, ms / 2);

        setTimeout(() => {
            const expected = {};
            expected.t1 = [2, 3];
            expected.t2 = [1, 8];
            expected.t3 = [7, 9, 10];
            expected.t4 = [11, 12, 4];
            expected.t5 = [5, 6];

            assertSchedule(actual, expected);
            done();
        }, 5.2 * ms);

        function schedule(count, timeout) {
            return (next) => {
                waiting++;
                const timerID = setTimeout(() => {
                    waiting--;
                    actualPush(actual, count, new Date().getTime() - timerInit);
                    next();
                }, timeout);

                return () => {
                    // should be synchronous
                    clearTimeout(timerID);
                    next();
                };
            };
        }
    });

});
