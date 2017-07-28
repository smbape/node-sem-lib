const fs = require("fs");
const sysPath = require("path");
const anyspawn = require("anyspawn");
const args = process.argv.slice(3).map(anyspawn.quoteArg);
const push = Array.prototype.push;
const hasProp = Object.prototype.hasOwnProperty;
const distribute = require("./scripts/distribute");

const opts = {
    stdio: "inherit",
    env: process.env,
    prompt: anyspawn.defaults.prompt
};

const testCommand = "node node_modules/karma/bin/karma start test/karma.conf.js";
const rootBowerFile = sysPath.join(__dirname, "bower.json");

const commands = {
    prepublish: distribute,

    version: [
        function(next) {
            fs.readFile(rootBowerFile, function(err, data) {
                if (err) {
                    next(err);
                    return;
                }
    
                const version = require("./package").version;
                let content = data.toString();
                content = content.replace(/^(\s*"version":\s*)"([^"]+)"/mg, "$1\"" + version + "\"");
                fs.writeFile(rootBowerFile, content, next);
            });
        },

        ["git", ["add", rootBowerFile]]
    ],

    test: function(next) {
        spawn([testCommand].concat(args).join(" "), next);
    },
};

const aliases = {
    distribute: "prepublish"
};

let command = process.argv[2];
if (hasProp.call(aliases, command)) {
    command = aliases[command];
}

if (hasProp.call(commands, command)) {
    spawn(commands[command]);
} else if (command != null) {
    throw new Error("unknown command " + command);
} else {
    console.log("Available commands", Object.keys(commands).sort());
}

function spawn(cmd) {
    let done;

    if (!Array.isArray(cmd)) {
        cmd = [cmd];
    }

    let arg;
    const last = arguments.length - 1;
    for (let i = 1; i < last; i++) {
        arg = arguments[i];
        if (Array.isArray(arg)) {
            push.call(cmd, arg);
        } else {
            cmd.push(arg);
        }
    }

    if (last > 0) {
        done = arguments[last];
    } else {
        done = Function.prototype;
    }

    anyspawn.spawnSeries(cmd, opts, done);
}
