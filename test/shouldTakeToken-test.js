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

describe("shouldTakeToken", () => {
    it("should take token when shouldTakeToken", async () => {
        const semID = semLib.semCreate(1, true);

        const fired = [];

        semID.semTake({
            shouldTakeToken: () => {
                return fired.length === 2;
            },

            onTake: () => {
                fired.push("low");
                semID.semGive();
            }
        });

        await ptimeout(5 * ms);

        // should not shouldTakeToken take
        expect(fired).to.deep.equal([]);

        semID.semTake({
            onTake: () => {
                fired.push("medium");
                semID.semGive();
            }
        });

        await ptimeout();

        expect(fired).to.deep.equal(["medium"]);

        semID.semTake({
            onTake: () => {
                fired.push("high");
                semID.semGive();
            }
        });

        await ptimeout();

        expect(fired).to.deep.equal(["medium", "high"]);

        await ptimeout();

        expect(fired).to.deep.equal(["medium", "high", "low"]);

    });
});
