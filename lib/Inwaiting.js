const RedBlackTreeNode = require("./SortedSet/RedBlackTreeNode");
const toInteger = require("./toInteger");

const hasProp = Object.hasOwnProperty;

// Debugging purpose
let globalCounter = 0;

class Inwaiting extends RedBlackTreeNode {
    constructor(semID, task, priority, num, options) {
        super();
        this.value = this;
        this.id = ++globalCounter;
        this.taken = 0;
        this.task = task;
        this.priority = priority;
        this.num = num;
        this.semaphore = semID;

        if (options) {
            [
                "onTimeOut",
                "onCancel",
                "unfair",
                "shouldTakeToken",
                "hasMissingToken",
                "sync",
                "hasNext"
            ].forEach(prop => {
                if (hasProp.call(options, prop)) {
                    this[prop] = options[prop];
                }
            });
        }
    }

    addCounter(nextNum) {
        this.num += toInteger(nextNum, true, 1);
    }

    cancel() {
        const {onCancel, taken, semaphore: semID} = this;
        semID._removeItem(this);

        if (taken !== 0) {
            // give on next tick to wait for all synchronous canceled to be done
            semID._setImmediate(() => {
                semID.semGive(taken, true);
            });
        }

        if (typeof onCancel === "function") {
            onCancel();
        }
    }

    setPriority(nextPriority) {
        if (this.group == null) {
            return;
        }

        const {semaphore: semID} = this;

        nextPriority = toInteger(nextPriority, false, semID.priority);
        if (nextPriority === this.priority) {
            return;
        }

        this.group.stack.remove(this);
        if (this.group.stack.length === 0) {
            // No more inWaiting for this priority group
            semID._queue.remove(this.group);
        }

        this.priority = nextPriority;
        semID._insertItem(this);
    }

    destroy() {
        // Remove properties to allow garbage collection
        Object.keys(this).forEach(prop => {
            switch(prop) {
                case "cancel":
                case "id":
                case "num":
                case "scheduled":
                case "taken":
                    break;
                default:
                    delete this[prop];
            }
        });

        // Prevent usage of these methods on a destroyed object
        ["addCounter", "setPriority", "destroy"].forEach(prop => {
            this[prop] = undefined;
        });

        this.destroyed = true;
    }
}

module.exports = Inwaiting;
