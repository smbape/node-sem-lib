var utils = require("../lib/utils.js");
var semLib = require("../");
var async = require('async');

function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

var ms = Math.pow(2, 4);

module.exports = {
    testConstructor: testConstructor,
    testGive: testGive,
    testFlush: testFlush,
    testTake: testTake
};

function testConstructor(assert) {
    assert.ok(semLib.hasOwnProperty('semCreate'));

    _testConstructor(assert);
    _testConstructor(assert, null);
    _testConstructor(assert, '');
    _testConstructor(assert, 'bla');
    _testConstructor(assert, 1.3);
    _testConstructor(assert, '1.3');
    _testConstructor(assert, 2, false);
    _testConstructor(assert, '2', false);
    _testConstructor(assert, 3, true);
    _testConstructor(assert, 3, 'false');

    assert.done();
}

function _testConstructor(assert, capacity, full) {
    var semID = semLib.semCreate(capacity, full);
    // utils.consoleWrite("_testConstructor", semID.getId());
    assert.ok(semID.hasOwnProperty('semGive'));
    assert.ok(semID.hasOwnProperty('semTake'));
    assert.ok(semID.hasOwnProperty('semFlush'));

    capacity = (capacity >= 1) ? parseInt(capacity) : 1;
    var counter = (full) ? capacity : 0;

    assert.strictEqual(semID.getCapacity(), capacity);
    assert.strictEqual(semID.getNumTokens(), counter);
    assert.strictEqual(semID.hasInWaitingTask(), false);
}

function testGive(assert) {
    _testGive(assert, null);
    _testGive(assert, '');
    _testGive(assert, 'bla');
    _testGive(assert, '-1');
    _testGive(assert, 1.3);
    _testGive(assert, '1.3');
    _testGive(assert, -1);
    _testGive(assert, 0);
    _testGive(assert);
    _testGive(assert, 1);
    _testGive(assert, 2);
    _testGive(assert, 3);
    assert.done();
}

function _testGive(assert, capacity) {
    capacity = (capacity >= 1) ? parseInt(capacity) : 1;
    var semID = semLib.semCreate(capacity);
    // utils.consoleWrite("_testGive", semID.getId());
    for (var i = 0; i < capacity; i++) {
        semID.semGive();
        assert.strictEqual(semID.getNumTokens(), i + 1);
    }
    semID.semGive();
    assert.strictEqual(semID.getNumTokens(), capacity);
    semID.semGive();
    assert.strictEqual(semID.getNumTokens(), capacity);
}

function testTake(assert) {
    // utils.consoleWrite("testTake");
    var timeOuted = false,
        fired = false;

    function shoot() {
        // utils.consoleWrite("fired");
        fired = true;
    }

    function run() {
        // utils.consoleWrite("timeOuted");
        timeOuted = true;
    }

    function reload() {
        fired = false;
        timeOuted = false;
    }

    // utils.consoleWrite("testTake", semID.getId());

    function testTakeNoArguments(next) {
        // utils.consoleWrite("semTake with no arguments");
        assert.throws(function() {
            semID.semTake();
        });
        next();
    }

    function testTakeNoFunction(next) {
        // utils.consoleWrite("semTake with not a function");
        assert.throws(function() {
            semID.semTake('bla');
        });
        assert.throws(function() {
            semID.semTake({
                onTake: 'bla'
            });
        });
        next();
    }

    function assertStillWaiting() {
        assert.strictEqual(fired, false);
        assert.strictEqual(timeOuted, false);
    }

    function assertChanged(semID, ms, hasFired, callback) {
        var timeFunc;
        if (ms === 0) {
            timeFunc = setImmediate;
        } else {
            timeFunc = setTimeout;
        }

        timeFunc(function() {
            if (hasFired) {
                assert.strictEqual(fired, true);
                assert.strictEqual(timeOuted, false);
            } else if (hasFired === null) {
                assert.strictEqual(fired, false);
                assert.strictEqual(timeOuted, false);
            } else {
                assert.strictEqual(fired, false);
                assert.strictEqual(timeOuted, true);
            }
            assert.strictEqual(semID.getNumTokens(), 0);
            assert.strictEqual(semID.hasInWaitingTask(), false);
            if (typeof callback == 'function') {
                callback();
            }
        }, ms);

    }

    function testTakeCallback(next) {
        reload();
        var semID = semLib.semCreate();
        semID.semTake(shoot);

        setTimeout(function() {
            assertStillWaiting();
            semID.semGive();
            assertChanged(semID, ms, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                next();
            });
        }, ms);
    }

    function testTakeSettings1(next) {
        reload();
        var semID = semLib.semCreate();
        semID.semTake({
            onTake: shoot
        });

        setTimeout(function() {
            assertStillWaiting();
            semID.semGive();
            assertChanged(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                next();
            });
        }, ms);
    }

    //If counter is empty, semTake must wait until there is a semGive
    function testTakeSettings2(next) {
        reload();
        var semID = semLib.semCreate();
        semID.semTake({
            num: 1,
            onTake: shoot
        });
        setTimeout(function() {
            assertStillWaiting();
            semID.semGive();
            assertChanged(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                next();
            });
        }, ms);
    }

    //If semGive occurs before timeout, semTake must succed
    function testTakeSettings3(next) {
        reload();
        var semID = semLib.semCreate(3);
        semID.semTake({
            num: 2,
            onTake: shoot,
            timeOut: ms * 2
        });
        setTimeout(function() {
            assertStillWaiting();
            semID.semGive(2);
            assertChanged(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                next();
            });
        }, ms);
    }

    //If no semGive occurs before timeout and no timeout func is given, take must failed
    function testTakeSettings4(next) {
        reload();
        var semID = semLib.semCreate(3);
        semID.semTake({
            num: 3,
            priority: 5,
            onTake: shoot,
            timeOut: ms / 2
        });
        assertChanged(semID, ms, null, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            next();
        });
    }

    //If semGive occurs before timeout, semTake must succed, even if timeout func is set
    function testTakeSettings5(next) {
        reload();
        var semID = semLib.semCreate(3);
        semID.semTake({
            onTake: shoot,
            onTimeOut: run,
            timeOut: ms * 2
        });
        setTimeout(function() {
            assertStillWaiting();
            semID.semGive();
            assertChanged(semID, 0, true, function() {
                assert.strictEqual(semID.hasInWaitingTask(), false);
                next();
            });
        }, ms);
    }

    // If no semGive occurs before timeout and timeout func is given, 
    // take must failed and timeout func must be called
    function testTakeSettings6(next) {
        reload();
        var semID = semLib.semCreate(3);
        semID.semTake({
            num: 3,
            onTake: shoot,
            timeOut: ms / 2,
            onTimeOut: run
        });
        assertChanged(semID, ms, false, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            next();
        });
    }

    // If timeout occurs before enough semGive and timeout func is given, 
    // take must failed and timeout func must be done
    function testTakeSettings7(next) {
        reload();
        var semID = semLib.semCreate(3);
        semID.semTake({
            num: 3,
            priority: 5,
            onTake: shoot,
            timeOut: ms / 2,
            onTimeOut: run
        });
        semID.semGive(2);
        assertChanged(semID, ms, false, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            next();
        });
    }

    // If enough semGive occurs before timeout and timeout func is given, 
    // take must succed
    function testTakeSettings8(next) {
        reload();
        var semID = semLib.semCreate(3);
        semID.semGive(1);
        semID.semTake({
            num: 3,
            priority: 5,
            onTake: shoot,
            timeOut: ms / 2,
            onTimeOut: run
        });
        semID.semGive(2);
        assertChanged(semID, 0, true, function() {
            assert.strictEqual(semID.hasInWaitingTask(), false);
            next();
        });
    }

    // Testing FIFO
    function testFIFO(next) {
        var semID = semLib.semCreate();
        var one = false,
            two = false,
            three = false;
        semID.semTake({
            onTake: function() {
                one = true;
            }
        });
        semID.semTake({
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
        semID.semGive();
        setTimeout(function() {
            assert.strictEqual(one, true);
            assert.strictEqual(two, false);
            assert.strictEqual(three, false);
            semID.semGive();
            setImmediate(function() {
                assert.strictEqual(one, true);
                assert.strictEqual(two, false);
                assert.strictEqual(three, true);
                assert.strictEqual(semID.getNumTokens(), 0);
                assert.strictEqual(semID.hasInWaitingTask(), false);
                next();
            });
        }, ms);
    }

    // Testing priority
    function testPriority(next) {
        var semID = semLib.semCreate();
        var one = false,
            two = false,
            three = false,
            four = false,
            five = false;
        semID.semTake({
            priority: 1,
            onTake: function() {
                // utils.consoleWrite("one");
                one = true;
            }
        });
        semID.semTake({
            priority: 2,
            onTake: function() {
                // utils.consoleWrite("two");
                two = true;
            }
        });
        semID.semTake({
            priority: 3,
            onTake: function() {
                // utils.consoleWrite("three");
                three = true;
            }
        });
        semID.semTake({
            priority: 1,
            onTake: function() {
                // utils.consoleWrite("four");
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
            setImmediate(function() {
                assert.strictEqual(one, true);
                assert.strictEqual(two, false);
                assert.strictEqual(three, false);
                assert.strictEqual(four, true);
                assert.strictEqual(five, false);
                semID.semTake({
                    priority: 1,
                    onTake: function() {
                        // utils.consoleWrite("five");
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
                            next();
                        });
                    });
                });
            });
        }, ms);
    }

    var testSuite = [
        testTakeNoArguments,
        testTakeNoFunction,
        testTakeCallback,
        testTakeSettings1,
        testTakeSettings2,
        testTakeSettings3,
        testTakeSettings4,
        testTakeSettings5,
        testTakeSettings6,
        testTakeSettings7,
        testTakeSettings8,
        testFIFO,
        testPriority
    ];
    async.series(testSuite, assert.done);
}

function testFlush(assert) {
    var fired = 0,
        timeOuted = 0;
    var semID = semLib.semCreate();

    function shoot() {
        // utils.consoleWrite("fired");
        fired++;
    }

    function run() {
        // utils.consoleWrite("timeOuted");
        timeOuted++;
    }

    semID.semTake({
        onTake: shoot,
        onTimeout: run
    });
    semID.semTake({
        onTake: shoot,
        onTimeout: run
    });
    semID.semTake({
        onTake: shoot,
        onTimeout: run
    });

    setTimeout(function() {
        assert.strictEqual(fired, 0);

        semID.semFlush();
        semID.semTake({
            timeOut: ms * 2,
            onTake: shoot,
            onTimeout: run
        });
        setTimeout(function() {
            // Flush before only free inWaitingTasks
            assert.strictEqual(fired, 3);
            semID.semFlush();
            setImmediate(function() {
                assert.strictEqual(fired, 4);
                assert.strictEqual(semID.hasInWaitingTask(), false);
                assert.done();
            });
        }, ms);
    }, ms);
}

if (!/\bnodeunit$/.test(process.argv[1])) {
    var reporter = require('nodeunit').reporters.default;
    reporter.run({
        test: module.exports
    });
} else if (false) {
    // For debugging purpose
    var assert = require('assert');
    var testSuite = module.exports;
    tests = [];
    for (prop in testSuite) {
        (function(fn) {
            tests.push(function(next) {
                assert.done = next;
                fn(assert);
            });
        })(testSuite[prop]);
    }
    async.series(tests, function() {
        console.log('done');
    });
}