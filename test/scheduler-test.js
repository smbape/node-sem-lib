/* eslint-env node, mocha */
/* eslint-disable no-magic-numbers */

const {assert, expect} = require("chai");

const semLib = require("../");

describe("schedule", function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);

    const ms = Math.pow(2, 9);
    const {hasOwnProperty: hasProp} = Object.prototype;

    function actualPush(actual, count, timerDiff) {
        // timerDiff may not be exact
        const key = `t${ timerDiff / ms >> 0 }`;
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

    it("should schedule array", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, 3 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
        ], () => {
            const expected = {};
            expected.t1 = [3];
            expected.t2 = [1, 4];
            expected.t3 = [2, 5, 6];
            expected.t4 = [7];

            try {
                assertSchedule(actual, expected);
                assert.strictEqual(item.scheduled, 7);
            } catch (err) {
                done(err);
                return;
            }

            setImmediate(() => {
                try {
                    assert.strictEqual(semID.getNumTokens(), 3);
                } catch (err) {
                    done(err);
                    return;
                }

                done();
            });
        });

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(i, timeout) {
            return next => {
                setTimeout(() => {
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule array with iteratee", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        const item = semID.schedule([
            [++count, 2 * ms],
            [++count, 3 * ms],
            [++count, ms],
            [++count, ms],
            [++count, ms],
            [++count, ms],
            [++count, ms],
        ], ([i, timeout], key, next) => {
            return schedule(i, timeout)(next);
        }, () => {
            const expected = {};
            expected.t1 = [3];
            expected.t2 = [1, 4];
            expected.t3 = [2, 5, 6];
            expected.t4 = [7];

            try {
                assertSchedule(actual, expected);
                assert.strictEqual(item.scheduled, 7);
            } catch (err) {
                done(err);
                return;
            }

            setImmediate(() => {
                try {
                    assert.strictEqual(semID.getNumTokens(), 3);
                } catch (err) {
                    done(err);
                    return;
                }

                done();
            });
        });

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(i, timeout) {
            return next => {
                setTimeout(() => {
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule object", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        const item = semID.schedule({
            s1: schedule(++count, 2 * ms),
            s2: schedule(++count, 3 * ms),
            s3: schedule(++count, ms),
            s4: schedule(++count, ms),
            s5: schedule(++count, ms),
            s6: schedule(++count, ms),
            s7: schedule(++count, ms),
        }, () => {
            const expected = {};
            expected.t1 = [3];
            expected.t2 = [1, 4];
            expected.t3 = [2, 5, 6];
            expected.t4 = [7];

            try {
                assertSchedule(actual, expected);
                assert.strictEqual(item.scheduled, 7);
            } catch (err) {
                done(err);
                return;
            }

            setImmediate(() => {
                try {
                    assert.strictEqual(semID.getNumTokens(), 3);
                } catch (err) {
                    done(err);
                    return;
                }

                done();
            });
        });

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(i, timeout) {
            return next => {
                setTimeout(() => {
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should schedule object with iteratee", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;

        const item = semID.schedule({
            s1: [++count, 2 * ms],
            s2: [++count, 3 * ms],
            s3: [++count, ms],
            s4: [++count, ms],
            s5: [++count, ms],
            s6: [++count, ms],
            s7: [++count, ms],
        }, ([i, timeout], key, next) => {
            return schedule(i, timeout)(next);
        }, () => {
            const expected = {};
            expected.t1 = [3];
            expected.t2 = [1, 4];
            expected.t3 = [2, 5, 6];
            expected.t4 = [7];

            try {
                assertSchedule(actual, expected);
                assert.strictEqual(item.scheduled, 7);
            } catch (err) {
                done(err);
                return;
            }

            setImmediate(() => {
                try {
                    assert.strictEqual(semID.getNumTokens(), 3);
                } catch (err) {
                    done(err);
                    return;
                }

                done();
            });
        });

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 0);

        function schedule(i, timeout) {
            return next => {
                setTimeout(() => {
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should cancel schedule before start", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;
        let completed = false;

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, 3 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
        ], err => {
            completed = true;
            expect(err).not.to.be.an("undefined");
            assert.strictEqual(err.code, "CANCELED");
            setImmediate(() => {
                assert.strictEqual(semID.getNumTokens(), 3);
            });
        });

        const timerInit = Date.now();
        assert.strictEqual(waiting, 0);
        assert.strictEqual(semID.getNumTokens(), 0);
        item.cancel();
        assert.strictEqual(waiting, 0);
        setImmediate(() => {
            assert.strictEqual(semID.getNumTokens(), 3);
        });

        setTimeout(() => {
            const expected = {};
            assert.strictEqual(waiting, 0);
            assert.strictEqual(completed, true);
            assertSchedule(actual, expected);
            done();
        }, 3.2 * ms);

        function schedule(i, timeout) {
            return next => {
                waiting++;
                setTimeout(() => {
                    waiting--;
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);
            };
        }
    });

    it("should cancel schedule after callback and before done", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;
        let completed = false;

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, 3 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
        ], err => {
            completed = true;
            expect(err).not.to.be.an("undefined");
            assert.strictEqual(err.code, "CANCELED");
            assert.strictEqual(semID.getNumTokens(), 3);
        });

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 0);

        setTimeout(() => {
            item.cancel();
            assert.strictEqual(waiting, 3);
            setImmediate(() => {
                assert.strictEqual(semID.getNumTokens(), 3);
            });
        }, ms / 2);

        setTimeout(() => {
            const expected = {};
            assert.strictEqual(completed, true);
            assertSchedule(actual, expected);
            done();
        }, 3.2 * ms);

        function schedule(i, timeout) {
            return next => {
                waiting++;
                const timerID = setTimeout(() => {
                    waiting--;
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);

                return () => {
                    // cancel should be synchronous ???
                    clearTimeout(timerID);
                    next();
                };
            };
        }
    });

    it("should cancel schedule when all tasks have been scheduled but not done executing", done => {
        const actual = {};
        const semID = semLib.semCreate(8, true, 15, true); // 7 tokens full capacity
        let count = 0;
        let waiting = 0;
        let completed = false;

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, 3 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
        ], err => {
            completed = true;
            expect(err).not.to.be.an("undefined");
            assert.strictEqual(err.code, "CANCELED");
            assert.strictEqual(semID.getNumTokens(), 8);
        });

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 1);

        setTimeout(() => {
            item.cancel();
            assert.strictEqual(waiting, 7);
            setImmediate(() => {
                assert.strictEqual(semID.getNumTokens(), 8);
            });
        }, ms / 2);

        setTimeout(() => {
            const expected = {};
            assert.strictEqual(completed, true);
            assertSchedule(actual, expected);
            done();
        }, 3.2 * ms);

        function schedule(i, timeout) {
            return next => {
                waiting++;
                const timerID = setTimeout(() => {
                    waiting--;
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);

                return () => {
                    // cancel should be synchronous ???
                    clearTimeout(timerID);
                    next();
                };
            };
        }
    });

    it("should change priority on the fly", done => {
        const actual = {};
        const semID = semLib.semCreate(3, true); // 3 tokens full capacity
        let count = 0;
        let waiting = 0;

        semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, 3 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
        ], 15);

        const item = semID.schedule([
            schedule(++count, 2 * ms),
            schedule(++count, 3 * ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
            schedule(++count, ms),
        ], 15);

        const timerInit = Date.now();
        assert.strictEqual(semID.getNumTokens(), 0);

        setTimeout(() => {
            item.setPriority(14);
            assert.strictEqual(waiting, 3);
            assert.strictEqual(semID.getNumTokens(), 0);
        }, ms / 2);

        setTimeout(() => {
            const expected = {
                t1: [3],
                t2: [1],
                t3: [2, 8],
                t4: [10, 11],
                t5: [9, 12, 13],
                t6: [14, 4, 5],
                t7: [6, 7],
            };

            assertSchedule(actual, expected);
            done();
        }, 8 * ms);

        function schedule(i, timeout) {
            return next => {
                waiting++;
                const timerID = setTimeout(() => {
                    waiting--;
                    actualPush(actual, i, Date.now() - timerInit);
                    next();
                }, timeout);

                return () => {
                    // cancel should be synchronous ???
                    clearTimeout(timerID);
                    next();
                };
            };
        }
    });

    it("should not hang when nesting schedule sync", done => {
        const actual = [];

        const expected = [];
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 4; j++) {
                expected.push(`${ i }.${ j }`);
            }
            expected.push(i);
        }

        const semID = semLib.semCreate(2, true, 15, true);

        semID.schedule([1, 2, 3, 4], (i, key, next) => {
            semID.schedule([1, 2, 3, 4], 0, (j, ikey, inext) => {
                    actual.push(`${ i }.${ j }`);
                    inext();
            }, err => {
                // take back the token given to the child
                semID.semTake({
                    priority: Number.NEGATIVE_INFINITY,
                    onTake: () => {
                        actual.push(i);
                        next();
                    }
                });
            });

            // give the token to the child
            semID.semGive();
        }, () => {
            try {
                expect(actual).to.deep.equal(expected);
            } catch (err) {
                done(err);
                return;
            }
            done();
        });
    });

    it("should not hang when nesting schedule async", done => {
        const actual = [];

        const expected = [];
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 4; j++) {
                expected.push(`${ i }.${ j }`);
            }
            expected.push(i);
        }

        const semID = semLib.semCreate(2, true, 15, false);

        semID.schedule([1, 2, 3, 4], (i, key, next) => {
            setImmediate(() => {
                semID.schedule([1, 2, 3, 4], 0, (j, ikey, inext) => {
                    setImmediate(() => {
                        actual.push(`${ i }.${ j }`);
                        inext();
                    });
                }, err => {
                    // take back the token given to the child
                    semID.semTake({
                        priority: Number.NEGATIVE_INFINITY,
                        onTake: () => {
                            actual.push(i);
                            next();
                        }
                    });
                });

                // give the token to the child
                semID.semGive();
            });
        }, () => {
            try {
                // when running async order of execution is not guaranteed
                // therefore only check if every expected tasks were run
                expect(actual.sort()).to.deep.equal(expected.sort());
            } catch (err) {
                done(err);
                return;
            }
            done();
        });
    });

});
