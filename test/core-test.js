/* global describe:false, it:false, assert:false */

const semLib = require("../");
const hasProp = Object.prototype.hasOwnProperty;
const ms = Math.pow(2, 4);

describe("basic", () => {
    it("should construct", () => {
        assert.ok(hasProp.call(semLib, "semCreate"));

        assertConstruct();
        assertConstruct(null);
        assertConstruct("");
        assertConstruct("bla");
        assertConstruct(1.3);
        assertConstruct("1.3");
        assertConstruct(2, false);
        assertConstruct("2", false);
        assertConstruct(3, true);
        assertConstruct(3, "false");

        function assertConstruct(capacity, full) {
            const semID = semLib.semCreate(capacity, full);
            assert.strictEqual(typeof semID.semGive, "function");
            assert.strictEqual(typeof semID.semTake, "function");
            assert.strictEqual(typeof semID.semFlush, "function");

            capacity = capacity >= 1 ? parseInt(capacity, 10) : 1;
            const counter = full ? capacity : 0;

            assert.strictEqual(semID.getCapacity(), capacity);
            assert.strictEqual(semID.getNumTokens(), counter);
            assert.strictEqual(semID.hasInWaitingTask(), false);
        }
    });

    it("should semGive", () => {
        assertGive(null);
        assertGive("");
        assertGive("bla");
        assertGive("-1");
        assertGive(1.3);
        assertGive("1.3");
        assertGive(-1);
        assertGive(0);
        assertGive();
        assertGive(1);
        assertGive(2);
        assertGive(3);

        function assertGive(capacity) {
            capacity = capacity >= 1 ? parseInt(capacity, 10) : 1;
            const semID = semLib.semCreate(capacity);

            // Check that tokens increase until capacity is reach
            for (let i = 0; i < capacity; i++) {
                semID.semGive();
                assert.strictEqual(semID.getNumTokens(), i + 1);
            }

            // When capacity is reach, tokens no more increased
            semID.semGive();
            assert.strictEqual(semID.getNumTokens(), capacity);
            semID.semGive();
            assert.strictEqual(semID.getNumTokens(), capacity);
        }
    });

    it("should semFlush", done => {
        let fired = 0;
        let timeOuted = 0;
        const semID = semLib.semCreate();

        function fire() {
            fired++;
        }

        function run() {
            timeOuted++;
        }

        semID.semTake({
            onTake: fire,
            onTimeout: run
        });
        semID.semTake({
            onTake: fire,
            onTimeout: run
        });
        semID.semTake({
            onTake: fire,
            onTimeout: run
        });

        setTimeout(function() {
            assert.strictEqual(fired, 0);

            assert.strictEqual(semID.hasInWaitingTask(), true);
            semID.semFlush();
            semID.semTake({
                timeOut: ms * 2,
                onTake: fire,
                onTimeout: run
            });
            setTimeout(function() {
                // Flush before only free inWaitingTasks
                assert.strictEqual(fired, 3);
                semID.semFlush();
                setImmediate(function() {
                    assert.strictEqual(fired, 4);
                    assert.strictEqual(timeOuted, 0);
                    assert.strictEqual(semID.hasInWaitingTask(), false);
                    done();
                });
            }, ms);
        }, ms);
    });
});

describe("take", () => {
    let timeOuted = false;
    let fired = false;

    function fire() {
        fired = true;
    }

    function run() {
        timeOuted = true;
    }

    function reload() {
        fired = false;
        timeOuted = false;
    }

    function assertStillWaiting(semID) {
        assert.strictEqual(fired, false);
        assert.strictEqual(timeOuted, false);
        assert.strictEqual(semID.hasInWaitingTask(), true);
    }

    function assertExpectedAfterMs(semID, ms, expected, callback) {
        let timeFunc;
        if (ms === 0) {
            timeFunc = setImmediate;
        } else {
            timeFunc = setTimeout;
        }

        timeFunc(function() {
            if (expected) {
                assert.strictEqual(fired, true);
                assert.strictEqual(timeOuted, false);
            } else if (expected === null) {
                assert.strictEqual(fired, false);
                assert.strictEqual(timeOuted, false);
            } else {
                assert.strictEqual(fired, false);
                assert.strictEqual(timeOuted, true);
            }
            // assert.strictEqual(semID.getNumTokens(), 0);
            assert.strictEqual(semID.hasInWaitingTask(), false);
            if (typeof callback === "function") {
                callback();
            }
        }, ms);

    }

    it("should semTake without arguments", () => {
        const semID = semLib.semCreate();
        semID.semTake();
        semID.semGive();
    });

    it("should ignore invalid take argument", () => {
        const semID = semLib.semCreate();
        semID.semTake("bla");
        semID.semTake({
            onTake: "bla"
        });
        semID.semGive();
        semID.semGive();
    });

    it("should take callback", done => {
        reload();
        const semID = semLib.semCreate();
        semID.semTake(fire);

        setTimeout(function() {
            assertStillWaiting(semID);
            semID.semGive();
            assertExpectedAfterMs(semID, ms, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                done();
            });
        }, ms);
    });

    it("should take object", done => {
        reload();
        const semID = semLib.semCreate();
        semID.semTake({
            onTake: fire
        });
        assert.strictEqual(semID.hasInWaitingTask(), true);

        setTimeout(function() {
            assertStillWaiting(semID);
            semID.semGive();
            assertExpectedAfterMs(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                done();
            });
        }, ms);
    });

    it("should wait for 1 token", done => {
        reload();
        const semID = semLib.semCreate();
        semID.semTake({
            num: 1,
            onTake: fire
        });
        setTimeout(function() {
            assertStillWaiting(semID);
            semID.semGive();
            assertExpectedAfterMs(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                done();
            });
        }, ms);
    });

    it("should wait not timeout", done => {
        reload();
        const semID = semLib.semCreate(3);
        semID.semTake({
            num: 2,
            onTake: fire,
            timeOut: ms * 2
        });
        setTimeout(function() {
            assertStillWaiting(semID);
            semID.semGive(2);
            assertExpectedAfterMs(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                done();
            });
        }, ms);
    });

    it("should remove on timeout", done => {
        reload();
        const semID = semLib.semCreate(3);
        semID.semTake({
            num: 3,
            priority: 5,
            onTake: fire,
            timeOut: ms / 2
        });
        assertExpectedAfterMs(semID, ms, null, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            done();
        });
    });

    it("should not call timeout callback", done => {
        reload();
        const semID = semLib.semCreate(3);
        semID.semTake({
            onTake: fire,
            onTimeOut: run,
            timeOut: ms * 2
        });
        setTimeout(function() {
            assertStillWaiting(semID);
            semID.semGive();
            assertExpectedAfterMs(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                done();
            });
        }, ms);
    });

    it("should call timeout callback on timeout", done => {
        reload();
        const semID = semLib.semCreate(3);
        semID.semTake({
            num: 3,
            onTake: fire,
            timeOut: ms / 2,
            onTimeOut: run
        });
        assertExpectedAfterMs(semID, ms, false, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            done();
        });
    });

    it("should call timeout callback if not enough token before timeout", done => {
        reload();
        const semID = semLib.semCreate(3);
        semID.semTake({
            num: 3,
            priority: 5,
            onTake: fire,
            timeOut: ms / 2,
            onTimeOut: run
        });
        semID.semGive(2);
        assertExpectedAfterMs(semID, ms, false, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            done();
        });
    });

    it("should not timeout if enough token", done => {
        reload();
        const semID = semLib.semCreate(3);
        semID.semGive(1);
        semID.semTake({
            num: 3,
            priority: 5,
            onTake: fire,
            timeOut: ms / 2,
            onTimeOut: run
        });
        semID.semGive(2);
        assertExpectedAfterMs(semID, 0, true, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            done();
        });
    });

    it("should first in first out", done => {
        const semID = semLib.semCreate();
        let one = false,
            two = false,
            three = false;
        semID.semTake({
            onTake: function() {
                one = true;
            }
        });
        semID.semTake({
            num: 2,
            timeOut: ms / 2,
            onTake: function() {
                two = true;
            }
        });
        semID.semTake({
            onTake: function() {
                three = true;
            }
        });
        semID.semGive(2, true); // way of doing semGive() + semGive() with capacity of 1
        setTimeout(function() {
            assert.strictEqual(one, true);
            assert.strictEqual(two, false);
            assert.strictEqual(three, true); // two has timeouted, giving back it's token
            semID.semGive();
            setImmediate(function() {
                assert.strictEqual(one, true);
                assert.strictEqual(two, false);
                assert.strictEqual(three, true);
                assert.strictEqual(semID.getNumTokens(), 1);
                assert.strictEqual(semID.hasInWaitingTask(), false);
                done();
            });
        }, ms);
    });

    it("should respect priority", done => {
        const semID = semLib.semCreate();
        let one = false,
            two = false,
            three = false,
            four = false,
            five = false;
        semID.semTake({
            priority: 1,
            onTake: function() {
                one = true;
            }
        });
        semID.semTake({
            priority: 2,
            onTake: function() {
                two = true;
            }
        });
        semID.semTake({
            priority: 3,
            onTake: function() {
                three = true;
            }
        });
        semID.semTake({
            priority: 1,
            onTake: function() {
                four = true;
            }
        });
        semID.semGive();
        setTimeout(function() {
            assert.strictEqual(one, true);
            assert.strictEqual(two, false);
            assert.strictEqual(three, false);
            assert.strictEqual(four, false);
            assert.strictEqual(five, false);
            semID.semGive();

            // Higher priority must take first, even if asked last
            setImmediate(function() {
                assert.strictEqual(one, true);
                assert.strictEqual(two, false);
                assert.strictEqual(three, false);
                assert.strictEqual(four, true);
                assert.strictEqual(five, false);
                semID.semTake({
                    priority: 1,
                    onTake: function() {
                        five = true;
                    }
                });
                semID.semGive();
                setImmediate(function() {
                    assert.strictEqual(one, true);
                    assert.strictEqual(two, false);
                    assert.strictEqual(three, false);
                    assert.strictEqual(four, true);
                    assert.strictEqual(five, true);
                    semID.semGive();
                    setImmediate(function() {
                        assert.strictEqual(one, true);
                        assert.strictEqual(two, true);
                        assert.strictEqual(three, false);
                        assert.strictEqual(four, true);
                        assert.strictEqual(five, true);
                        semID.semGive();
                        setImmediate(function() {
                            assert.strictEqual(three, true);
                            assert.strictEqual(semID.hasInWaitingTask(), false);
                            done();
                        });
                    });
                });
            });
        }, ms);
    });
});

describe("destroy", function () {
    const ms = 10;

    it("should safe destroy", done => {
        const semID = semLib.semCreate();
        let taken = false;

        semID.semTake({
            timeOut: ms,
            onTake: function() {
                taken = true;
            }
        });

        assert.strictEqual(semID.destroy(), true);
        setTimeout(function() {
            assert.strictEqual(semID.semGive(), true);
            assert.strictEqual(semID.semTake(), false);
            setTimeout(function() {
                assert.strictEqual(taken, true);
                assert.strictEqual(semID.hasInWaitingTask(), false);
                assert.strictEqual(semID.isAlive(), false);
                done();
            }, ms);
        }, ms / 2);
    });

    it("should unsafe destroy", done => {
        const semID = semLib.semCreate();
        let taken = false;

        semID.semTake({
            timeOut: ms,
            onTake: function() {
                taken = true;
            }
        });

        assert.strictEqual(semID.destroy(false), true);
        setTimeout(function() {
            assert.strictEqual(semID.semGive(), false);
            assert.strictEqual(semID.semTake(), false);
            assert.strictEqual(semID.semFlush(), false);
            setTimeout(function() {
                assert.strictEqual(taken, false);
                assert.strictEqual(semID.destroyed, true);
                assert.strictEqual(semID.hasInWaitingTask(), false);
                assert.strictEqual(semID.isAlive(), false);
                done();
            }, ms);
        }, ms / 2);
    });
});
