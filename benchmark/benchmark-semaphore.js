const {Semaphore} = require("../");
const {Benchmark, Suite} = require("benchmark");

const suite = new Suite();
Benchmark.options.maxTime = 15;

const semaphores = {};

Benchmark.options.onStart = ({target: { name, running }}) => {
    const len = semaphores[name];
    const semID = new Semaphore(1, false, 15, true);
    semaphores[name] = semID;

    for (let i = 0; i < len; i++) {
        semID.semTake();
    }
};

// Benchmark.options.onCycle = ({target: { name, running }}) => {
//     if (!running) {
//         semaphores[name].destroy(false);
//         delete semaphores[name];
//     }
// };

const addSuite = len => {
    const name = `semaphore ${ len }`.padStart(18, " ");
    semaphores[name] = len;

    suite
        .add(name, () => {
            semaphores[name].semTake();
            semaphores[name].semGive();
        });
};

for (let i = 0; i <= 10; i++) {
    addSuite(i);
}

for (let i = 2; i <= 6; i++) {
    addSuite(Math.pow(10, i));
}

for (let i = 4; i <= 12; i += 4) {
    addSuite(i * Math.pow(10, 6));
}

suite
    .on("cycle", ({target}) => {
        semaphores[target.name].destroy(false);
        delete semaphores[target.name];
        if (global.gc) {
            global.gc();
        }
        console.log(String(target));
    })
    .on("complete", function() {
        // eslint-disable-next-line no-invalid-this
        console.log(`Fastest is ${ this.filter("fastest").map("name").toString().trim() }`);
    })
    .run({
        async: true,
    });
