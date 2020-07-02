const Semaphore = require("./Semaphore");
const Inwaiting = require("./Inwaiting");

Object.assign(exports, {
    semCreate: (...args) => {
        return new Semaphore(...args);
    },
    Semaphore,
    Inwaiting
});
