/* global describe:false, it:false, assert:false */

const semLib = require("../");

describe("schedule", function() {
    // this.timeout(300 * 1000);
    const ms = Math.pow(2, 5);

    function assertSchedule(actual, expected) {
        assert.strictEqual(actual.length, expected.length);
        let acval, exval, diff;
        for (let i = 0, len = actual.length; i < len; i++) {
            acval = actual[i];
            exval = expected[i];
            assert.strictEqual(acval[0], exval[0]);
            diff = Math.abs(exval[1] - acval[1]);
            assert.ok(diff <= ms / 2);
        }
    }

    it("should schedule", (done) => {
        const actual = [];
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        const timerInit = new Date().getTime();
        semID.schedule([
            schedule(++count, 2 * ms), // take 1/3 token
            schedule(++count, ms), // take 2/3 token
            schedule(++count, ms), // take 3/3 token
            schedule(++count, ms), // get token given by 2
            schedule(++count, ms), // get token given by 3
            schedule(++count, ms)
        ], () => {
            const expected = [
                [2, ms], // take 1/3 token
                [3, ms], // take 2/3 token
                [1, 2 * ms], // take 3/3 token
                [4, ms + ms], // get token given by 2
                [5, ms + ms], // get token given by 3
                [6, ms + ms + ms], // get token given by 1
            ];

            assertSchedule(actual, expected);
            done();
        });

        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(count, timeout) {
            return (next) => {
                setTimeout(() => {
                    actual.push([count, new Date().getTime() - timerInit]);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule object", (done) => {
        const actual = [];
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        const timerInit = new Date().getTime();

        semID.schedule({
            s1: schedule(++count, 2 * ms), // take 1/3 token
            s2: schedule(++count, ms), // take 2/3 token
            s3: schedule(++count, ms), // take 3/3 token
            s4: schedule(++count, ms), // get token given by 2
            s5: schedule(++count, ms), // get token given by 3
            s6: schedule(++count, ms)
        }, () => {
            const expected = [
                [2, ms], // take 1/3 token
                [3, ms], // take 2/3 token
                [1, 2 * ms], // take 3/3 token
                [4, ms + ms], // get token given by 2
                [5, ms + ms], // get token given by 3
                [6, ms + ms + ms], // get token given by 1
            ];

            assertSchedule(expected, actual);
            done();
        });

        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(count, timeout) {
            return (next) => {
                setTimeout(() => {
                    actual.push([count, new Date().getTime() - timerInit]);
                    next();
                }, timeout);
            };
        }
    });

    it("should cancel schedule before start", (done) => {
        const actual = [];
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;
        const timerInit = new Date().getTime();
        const item = semID.schedule([
            schedule(++count, 2 * ms), // take 1/3 token
            schedule(++count, ms), // take 2/3 token
            schedule(++count, ms), // take 3/3 token
            schedule(++count, ms), // get token given by 2
            schedule(++count, ms), // get token given by 3
            schedule(++count, ms)
        ]);

        assert.strictEqual(waiting, 0);
        assert.strictEqual(semID.getNumTokens(), 0);
        item.cancel();
        assert.strictEqual(waiting, 0);
        assert.strictEqual(semID.getNumTokens(), 3);

        setTimeout(() => {
            const expected = [];
            assert.strictEqual(waiting, 0);
            assertSchedule(expected, actual);
            done();
        }, 3.2 * ms);

        function schedule(count, timeout) {
            return (next) => {
                waiting++;
                setTimeout(() => {
                    waiting--;
                    actual.push([count, new Date().getTime() - timerInit]);
                    next();
                }, timeout);
            };
        }
    });

    it("should cancel schedule after callback and before done", (done) => {
        const actual = [];
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;
        const timerInit = new Date().getTime();
        const item = semID.schedule([
            schedule(++count, 2 * ms), // take 1/3 token
            schedule(++count, ms), // take 2/3 token
            schedule(++count, ms), // take 3/3 token
            schedule(++count, ms), // get token given by 2
            schedule(++count, ms), // get token given by 3
            schedule(++count, ms)
        ]);

        assert.strictEqual(semID.getNumTokens(), 0);

        setTimeout(() => {
            item.cancel();
            assert.strictEqual(waiting, 3);
            assert.strictEqual(semID.getNumTokens(), 3);
        }, ms / 2);

        setTimeout(() => {
            const expected = [];
            assertSchedule(expected, actual);
            done();
        }, 3.2 * ms);

        function schedule(count, timeout) {
            return (next) => {
                waiting++;
                const timerID = setTimeout(() => {
                    waiting--;
                    actual.push([count, new Date().getTime() - timerInit]);
                    next();
                }, timeout);

                return ()=> {
                    // should be synchronous
                    clearTimeout(timerID);
                    next();
                };
            };
        }
    });

});
