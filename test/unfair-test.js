/* global describe:false, it:false, expect:false */

const semLib = require("../");
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

describe("unfair", () => {
    it("should take token from lower priority", async () => {
        const capacity = 8;
        const priority = 15;
        const semID = semLib.semCreate(capacity, false, priority);

        const fired = [];

        const first = semID.semTake({
            num: capacity,
            priority: priority + 1,
            onTake: () => {
                fired.push("low");
                semID.semGive(capacity);
            }
        });

        const second = semID.semTake({
            num: capacity / 2,
            priority: priority - 1,
            onTake: () => {
                fired.push("high");
                semID.semGive(capacity / 2);
            }
        });

        semID.semGive(capacity / 2 - 1);

        await ptimeout(ms);

        const third = semID.semTake({
            num: 1,
            priority,
            unfair: true,
            onTake: () => {
                fired.push("normal");
            }
        });

        await ptimeout(ms);

        // should not take token from higher priority, even if unfair
        expect(fired).to.deep.equal([]);

        third.cancel();
        semID.semGive(1);
        await ptimeout(ms);

        const fourth = semID.semTake({
            num: capacity / 2,
            priority,
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

        expect(first.taken).to.equal(capacity);
        expect(second.taken).to.equal(capacity / 2);
        expect(third.taken).to.equal(0);
        expect(fourth.taken).to.equal(capacity / 2);

        expect(fired).to.deep.equal(["high", "normal", "low"]);
    });

    it("should take token from lower priority sync", async () => {
        const capacity = 8;
        const priority = 15;
        const semID = semLib.semCreate(capacity, false, priority, true);

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
            priority,
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
            priority,
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
