/* global describe:false, it:false, assert:false */

const semLib = require("../");
const hasProp = Object.hasOwnProperty;
const ms = 1;
const ptimeout = delay => {
    return new Promise((resolve, reject) => {
        if (delay == null) {
            setImmediate(resolve);
        } else {
            setTimeout(resolve, delay);
        }
    });
};

describe("changes", () => {
    it("should take token from lower priority", async () => {
        const capacity = 8;
        const priority = 15;
        const semID = semLib.semCreate(capacity, false, priority);

        const fired = [];

        semID.semTake({
            num: capacity,
            priority: priority + 1,
            onTake: () => {
                fired.push("low");
                semID.semGive(capacity);
            }
        });

        semID.semTake({
            num: capacity / 2,
            priority: priority - 1,
            onTake: () => {
                fired.push("high");
                semID.semGive(capacity / 2);
            }
        });

        semID.semGive(capacity / 2 - 1);

        await ptimeout(ms);

        const task = semID.semTake({
            num: 1,
            priority: priority,
            unfair: true,
            onTake: () => {
                fired.push("normal");
            }
        });

        await ptimeout(ms);

        // should not take token from higher priority, even if unfair
        expect(fired).to.deep.equal([]);

        task.cancel();
        semID.semGive(1);
        await ptimeout(ms);

        semID.semTake({
            num: capacity / 2,
            priority: priority,
            unfair: true,
            onTake: () => {
                fired.push("normal");
                semID.semGive(capacity / 2);
            }
        });

        await ptimeout(ms);

        // should take from lower priority because of unfair
        expect(fired).to.deep.equal(["high", "normal"]);

        semID.semGive(capacity / 2);

        await ptimeout(ms);

        expect(fired).to.deep.equal(["high", "normal", "low"]);
    });
});
