const {Semaphore, Inwaiting} = require("../");

const gc = (() => {
    require("v8").setFlagsFromString("--expose-gc");
    return require("vm").runInNewContext("gc");
})();

const MB = Math.pow(1024, 2);

const printUsage = prefix => {
    gc();
    const {heapUsed, heapTotal, rss, external} = process.memoryUsage();
    console.log(prefix.padStart(15, " "), (heapUsed + external) / MB);
};

const len = 1024 * 1024;

const semID = new Semaphore(1, false, 15, true);

printUsage("before");

let taken = 0;
const handleTake = () => {
    taken++;
};

printUsage("before semTake");

for (let i = 0; i < len; i++) {
    semID.semTake(handleTake);
}

printUsage("semTake");

for (let i = 0; i < len; i++) {
    semID.semGive();
}

printUsage("after semTake");

console.log("taken".padStart(15, " "), taken);

const schedules = new Array(len);
for (let i = 0; i < len; i++) {
    schedules[i] = i;
}

console.log("=".repeat(15));

printUsage("before schedule");

let scheduled = 0;
semID.schedule(schedules, (i, key, next) => {
    scheduled++;
    next();
}, Function.prototype);

printUsage("schedule");

semID.semGive();

printUsage("after schedule");

console.log("scheduled".padStart(15, " "), scheduled);

schedules.length = 0;

printUsage("after");
