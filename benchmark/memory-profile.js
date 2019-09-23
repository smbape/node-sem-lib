const {Semaphore, Inwaiting} = require("../");

const gc = (() => {
    require("v8").setFlagsFromString("--expose-gc");
    return require("vm").runInNewContext("gc");
})();

const MB = Math.pow(1024, 2);

const printUsage = prefix => {
    gc();
    const {heapUsed, heapTotal, rss, external} = process.memoryUsage();
    console.log(prefix.padStart(12, " "), (heapUsed + external) / MB);
};

// require("../lib/semlib").init({
//     // wasmBinaryFile: null,
//     // TOTAL_MEMORY: 16 * 1024 * 1024
// }, (err, Module) => {
//     if (err) {
//         throw err;
//     }

    const len = 1024 * 1024;

    // const group = new Module.Group(15);
    const semID = new Semaphore(1, false, 15, true);
    const inwaitings = new Array(len);
    // const InwaitingMemory = new Array(5 * len);
    // const InwaitingMemory = Buffer.allocUnsafe(5 * len);

    printUsage("before");
    for (let i = 0; i < len; i++) {
        // inwaitings[i] = group.insert(0, 0, 15, false, false);
        // if ((i + 1) % 10000 === 0) {
        //     console.log(group.size());
        // }
        // inwaitings[i] = i;
        // InwaitingMemory[5 * i] = 239; // semID;
        // InwaitingMemory[5 * i + 1] = 0;
        // InwaitingMemory[5 * i + 2] = 15;
        // InwaitingMemory[5 * i + 3] = 1;
        // InwaitingMemory[5 * i + 4] = 0;
        // inwaitings[i] = Buffer.allocUnsafe(5);
        inwaitings[i] = new Inwaiting(semID, Function.prototype, 15, 1, false);
    }
    printUsage("Inwaiting");
    // for (let i = 0; i < len; i++) {
    //     group.remove(inwaitings[i]);
    //     // if ((i + 1) % 10000 === 0) {
    //     //     console.log(group.size());
    //     // }
    // }
    // group.delete();
    inwaitings.length = 0;
    // InwaitingMemory.length = 0;
    printUsage("after");

    // let count = 0;
    // const handleTake = () => {
    //     count++;
    // };

    // printUsage("before");

    // for (let i = 0; i < len; i++) {
    //     semID.semTake(handleTake);
    // }

    // printUsage("semTake");

    // for (let i = 0; i < len; i++) {
    //     semID.semGive();
    // }

    // printUsage("after");

    // console.log("count".padStart(12, " "), count);
// });
