#!/usr/bin/env node
/*eslint dot-location: ["error", "property"]*/

const yargs = require("yargs")
    .usage(`webpack ${ require("webpack/package.json").version }\n` +
        "Usage: https://webpack.js.org/api/cli/\n" +
        "Usage without config file: webpack <entry> [<entry>] <output>\n" +
        "Usage with config file: webpack");

require("webpack/bin/config-yargs")(yargs);

const DISPLAY_GROUP = "Stats options:";
const BASIC_GROUP = "Basic options:";

yargs.options({
    json: {
        type: "boolean",
        alias: "j",
        describe: "Prints the result as JSON."
    },
    progress: {
        type: "boolean",
        describe: "Print compilation progress in percentage",
        group: BASIC_GROUP
    },
    color: {
        type: "boolean",
        alias: "colors",
        default: function supportsColor() { // eslint-disable-line func-name-matching
            return requireFromWebpack("supports-color");
        },
        group: DISPLAY_GROUP,
        describe: "Enables/Disables colors on the console"
    },
    "sort-modules-by": {
        type: "string",
        group: DISPLAY_GROUP,
        describe: "Sorts the modules list by property in module"
    },
    "sort-chunks-by": {
        type: "string",
        group: DISPLAY_GROUP,
        describe: "Sorts the chunks list by property in chunk"
    },
    "sort-assets-by": {
        type: "string",
        group: DISPLAY_GROUP,
        describe: "Sorts the assets list by property in asset"
    },
    "hide-modules": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Hides info about modules"
    },
    "display-exclude": {
        type: "string",
        group: DISPLAY_GROUP,
        describe: "Exclude modules in the output"
    },
    "display-modules": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display even excluded modules in the output"
    },
    "display-max-modules": {
        type: "number",
        group: DISPLAY_GROUP,
        describe: "Sets the maximum number of visible modules in output"
    },
    "display-chunks": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display chunks in the output"
    },
    "display-entrypoints": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display entry points in the output"
    },
    "display-origins": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display origins of chunks in the output"
    },
    "display-cached": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display also cached modules in the output"
    },
    "display-cached-assets": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display also cached assets in the output"
    },
    "display-reasons": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display reasons about module inclusion in the output"
    },
    "display-depth": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display distance from entry point for each module"
    },
    "display-used-exports": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display information about used exports in modules (Tree Shaking)"
    },
    "display-provided-exports": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display information about exports provided from modules"
    },
    "display-optimization-bailout": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display information about why optimization bailed out for modules"
    },
    "display-error-details": {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Display details about errors"
    },
    display: {
        type: "string",
        group: DISPLAY_GROUP,
        describe: "Select display preset (verbose, detailed, normal, minimal, errors-only, none)"
    },
    verbose: {
        type: "boolean",
        group: DISPLAY_GROUP,
        describe: "Show more details"
    }
});

const yargsParse = () => {
    return new Promise((resolve, reject) => {
        // yargs will terminate the process early when the user uses help or version.
        // This causes large help outputs to be cut short (https://github.com/nodejs/node/wiki/API-changes-between-v0.10-and-v4#process).
        // To prevent this we use the yargs.parse API and exit the process normally
        yargs.parse(process.argv.slice(2), (err, argv, output) => {
            Error.stackTraceLimit = 30;

            // arguments validation failed
            if (err && output) {
                reject(output);
                return;
            }

            // help or version info
            if (output) {
                console.log(output);
                resolve();
                return;
            }

            if (argv.verbose) {
                argv.display = "verbose";
            }

            resolve(argv);
        });
    });
};

const hasProp = Object.prototype.hasOwnProperty;
const defaults = require("lodash/defaults");

module.exports = processOptions;

function getPromisableOptions(callback, options) {
    if ("function" === typeof options) {
        const _callback = options;
        options = callback;
        callback = _callback;
    }


    // process Promise
    if (typeof options.then === "function") {
        options.then(getPromisableOptions.bind(null, callback)).catch(err => {
            console.error(err.stack || err);
            process.exit(); // eslint-disable-line
        });
        return;
    }

    callback(options);
}

function processOptions(options, done) {
    getPromisableOptions(yargsParse(), argv => {
        getPromisableOptions(options, opts => {
            options = require("webpack/bin/convert-argv")(yargs, argv, opts.convertOptions);
            Object.assign(options, opts);
            delete options.convertOptions

            function ifArg(name, fn, init) {
                if (Array.isArray(argv[name])) {
                    if (init) {
                        init();
                    }

                    argv[name].forEach(fn);
                } else if (typeof argv[name] !== "undefined") {
                    if (init) {
                        init();
                    }
                    fn(argv[name], -1);
                }
            }

            /**
             * When --silent flag is present, an object with a no-op write method is
             * used in place of process.stout
             */
            const stdout = argv.silent ? {
                write: Function.prototype
            } : process.stdout;

            const firstOptions = [].concat(options)[0];
            const statsPresetToOptions = require("webpack/lib/Stats.js").presetToOptions;

            let outputOptions = options.stats;
            if (typeof outputOptions === "boolean" || typeof outputOptions === "string") {
                outputOptions = statsPresetToOptions(outputOptions);
            } else if (!outputOptions) {
                outputOptions = {};
            }

            ifArg("display", preset => {
                outputOptions = statsPresetToOptions(preset);
            });

            outputOptions = Object.create(outputOptions);
            if (Array.isArray(options) && !outputOptions.children) {
                outputOptions.children = options.map(o => o.stats);
            }
            if (typeof outputOptions.context === "undefined") {
                outputOptions.context = firstOptions.context;
            }

            ifArg("env", value => {
                if (outputOptions.env) {
                    outputOptions._env = value;
                }
            });

            ifArg("json", bool => {
                if (bool) {
                    outputOptions.json = bool;
                }
            });

            if (typeof outputOptions.colors === "undefined") {
                outputOptions.colors = requireFromWebpack("supports-color");
            }

            ifArg("sort-modules-by", value => {
                outputOptions.modulesSort = value;
            });

            ifArg("sort-chunks-by", value => {
                outputOptions.chunksSort = value;
            });

            ifArg("sort-assets-by", value => {
                outputOptions.assetsSort = value;
            });

            ifArg("display-exclude", value => {
                outputOptions.exclude = value;
            });

            if (!outputOptions.json) {
                if (typeof outputOptions.cached === "undefined") {
                    outputOptions.cached = false;
                }
                if (typeof outputOptions.cachedAssets === "undefined") {
                    outputOptions.cachedAssets = false;
                }

                ifArg("display-chunks", bool => {
                    if (bool) {
                        outputOptions.modules = false;
                        outputOptions.chunks = true;
                        outputOptions.chunkModules = true;
                    }
                });

                ifArg("display-entrypoints", bool => {
                    if (bool) {
                        outputOptions.entrypoints = true;
                    }
                });

                ifArg("display-reasons", bool => {
                    if (bool) {
                        outputOptions.reasons = true;
                    }
                });

                ifArg("display-depth", bool => {
                    if (bool) {
                        outputOptions.depth = true;
                    }
                });

                ifArg("display-used-exports", bool => {
                    if (bool) {
                        outputOptions.usedExports = true;
                    }
                });

                ifArg("display-provided-exports", bool => {
                    if (bool) {
                        outputOptions.providedExports = true;
                    }
                });

                ifArg("display-optimization-bailout", bool => {
                    if (bool) {
                        outputOptions.optimizationBailout = bool;
                    }
                });

                ifArg("display-error-details", bool => {
                    if (bool) {
                        outputOptions.errorDetails = true;
                    }
                });

                ifArg("display-origins", bool => {
                    if (bool) {
                        outputOptions.chunkOrigins = true;
                    }
                });

                ifArg("display-max-modules", value => {
                    outputOptions.maxModules = Number(value);
                });

                ifArg("display-cached", bool => {
                    if (bool) {
                        outputOptions.cached = true;
                    }
                });

                ifArg("display-cached-assets", bool => {
                    if (bool) {
                        outputOptions.cachedAssets = true;
                    }
                });

                if (!outputOptions.exclude) {
                    outputOptions.exclude = ["node_modules", "bower_components", "components"];
                }

                if (argv["display-modules"]) {
                    outputOptions.maxModules = Infinity;
                    outputOptions.exclude = undefined;
                    outputOptions.modules = true;
                }
            }

            ifArg("hide-modules", bool => {
                if (bool) {
                    outputOptions.modules = false;
                    outputOptions.chunkModules = false;
                }
            });

            const webpack = require("webpack/lib/webpack.js");

            Error.stackTraceLimit = 30;
            let lastHash = null;
            let compiler;
            try {
                compiler = webpack(options);
            } catch ( err ) {
                if (err.name === "WebpackOptionsValidationError") {
                    if (argv.color) {
                        console.error(
                            `\u001b[1m\u001b[31m${ err.message }\u001b[39m\u001b[22m`
                        );
                    } else {
                        console.error(err.message);
                    }
                    // eslint-disable-next-line no-process-exit
                    process.exit(1);
                }

                throw err;
            }

            if (argv.progress) {
                const ProgressPlugin = require("webpack/lib/ProgressPlugin");
                compiler.apply(new ProgressPlugin({
                    profile: argv.profile
                }));
            }

            function compilerCallback(err, stats) {
                if (!options.watch || err) {
                    // Do not keep cache anymore
                    compiler.purgeInputFileSystem();
                }
                if (err) {
                    lastHash = null;
                    if (!options.watch) {
                        done.apply(null, arguments);
                        return;
                    }
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                    process.exitCode = 1;
                    return;
                }
                if (outputOptions.json) {
                    stdout.write(`${ JSON.stringify(stats.toJson(outputOptions), null, 2) }\n`);
                } else if (stats.hash !== lastHash) {
                    lastHash = stats.hash;
                    const statsString = stats.toString(outputOptions);
                    if (statsString) {
                        stdout.write(`${ statsString }\n`);
                    }
                    if (!options.watch) {
                        done.apply(null, arguments);
                        return;
                    }
                }
                if (!options.watch && stats.hasErrors()) {
                    done(2);
                }
            }
            if (firstOptions.watch || options.watch) {
                const watchOptions = firstOptions.watchOptions || firstOptions.watch || options.watch || {};
                if (watchOptions.stdin) {
                    process.stdin.on("end", () => {
                        process.exit(); // eslint-disable-line
                    });
                    process.stdin.resume();
                }
                compiler.watch(watchOptions, compilerCallback);
                console.log("\nWebpack is watching the files…\n");
            } else {
                compiler.run(compilerCallback);
            }
        });
    });
}

function requireFromWebpack(name) {
    try {
        return require(`webpack/node_modules/${ name }`);
    } catch ( e ) {
        return require(name);
    }
}
