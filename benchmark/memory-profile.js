const {Semaphore} = require("../");

const MB = Math.pow(1024, 2);

const printUsage = prefix => {
    if (global.gc) {
        global.gc();
    }
    const {heapUsed, heapTotal, rss, external} = process.memoryUsage();

    console.log(prefix.padStart(12, " "), (heapUsed + external) / MB);
};

const semID = new Semaphore(1, false, 15, true);
const len = 256 * 1024;

let count = 0;
const handleTake = () => {
    count++;
};

printUsage("before");

for (let i = 0; i < len; i++) {
    semID.semTake(handleTake);
}

printUsage("semTake");

for (let i = 0; i < len; i++) {
    semID.semGive();
}

printUsage("after");

console.log("count".padStart(12, " "), count);
