const sysPath = require("path");
const webpack = require("./webpack");
const merge = require("lodash/merge");
const anyspawn = require("anyspawn");
const rootpath = sysPath.resolve(__dirname, "..");

module.exports = function(options, done) {
    const coverage = /^(?:1|true|on|TRUE|ON)$/.test(String(process.env.COVERAGE));

    if ("function" === typeof options) {
        done = options;
        options = {
            coverage: coverage
        };
    }

    if ("function" !== typeof done) {
        done = Function.prototype;
    }

    if (options == null) {
        options = {
            coverage: coverage
        };
    }

    if (options.coverage === undefined) {
        options.coverage = coverage;
    }

    const allTasks = tasks("development", "", options).concat(tasks("production", "", options));

    allTasks.push(...[
        ["node", [
            "node_modules/uglify-js/bin/uglifyjs",
            "dist/sem-lib.js",
            "--source-map", "filename=dist/sem-lib.min.js.map,content=dist/sem-lib.js.map",
            "-o", "dist/sem-lib.min.js",
            "--compress",
            "--mangle",
        ]]
    ]);

    anyspawn.spawnSeries(allTasks, {
        stdio: "inherit",
        env: process.env,
        cwd: rootpath,
        prompt: true
    }, done);
};

function tasks(NODE_ENV, suffix, options) {
    let loaders = getLoaders();

    const entries = {
        "sem-lib": sysPath.join(rootpath, "lib", "sem-lib.js")
    };

    let NODE_ENV_;

    const tasks = [
        next => {
            NODE_ENV_ = process.env.NODE_ENV;
            process.env.NODE_ENV = NODE_ENV;
            next();
        }
    ];
    addPackTasks(entries, suffix, loaders, tasks);

    if (options.coverage) {
        const ispartaLoader = require.resolve("./isparta-loader") + "?" + JSON.stringify({
            instrumenter: {
                embedSource: true,
                noAutoWrap: true,
                babel: "inherit",
                preserveComments: true,
                keepIfStatement: true,
                keepCommentBlock: true,
            // noCompact: true,
            },
            include: /[/\\]src[/\\]/.source
        });

        loaders = getLoaders(ispartaLoader);
        suffix = suffix + "-cov";
        addPackTasks(entries, suffix, loaders, tasks);
    }

    tasks.push(next => {
        process.env.NODE_ENV = NODE_ENV_;
        next();
    });

    return tasks;
}

function addPackTasks(entries, suffix, loaders, tasks) {
    const options = {};
    const externals = {};
    options.externals = externals;

    let name, camelExternalName;

    // eslint-disable-next-line guard-for-in
    for (name in entries) {
        camelExternalName = camelize(name + suffix);
        externals[name] = {
            amd: name + suffix,
            commonjs: camelExternalName,
            commonjs2: camelExternalName,
            root: camelExternalName
        };
    }

    // eslint-disable-next-line guard-for-in
    for (name in entries) {
        tasks.push(pack.bind(null, name, suffix, entries[name], loaders, options));
    }
}

function getLoaders(ispartaLoader) {
    const jsLoaders = ["babel-loader"];

    if (ispartaLoader) {
        jsLoaders.push(ispartaLoader);
    }

    const loaders = [{
        test: /\.js$/,
        loaders: jsLoaders
    }, {
        test: /\.coffee$/,
        loaders: ["coffee-loader"]
    }];

    return loaders;
}

function pack(name, suffix, entry, loaders, options, done) {
    options = merge({
        devtool: "source-map",
        resolve: {
            extensions: [".js", ".coffee"]
        },
        entry: entry,
        output: {
            path: sysPath.join(rootpath, "dist"),
            filename: name + suffix + ".js",
            library: camelize(name + suffix),
            libraryTarget: "umd",
            sourceMapFilename: name + suffix + ".js.map",
            devtoolModuleFilenameTemplate: function devtoolModuleFilenameTemplate(obj) {
                const resourcePath = obj.resourcePath.replace(/(^|[/\\])(?:([^/\\]+)(\.[^/\\.]+)|([^/\\]+))$/, "$1$2$4" + suffix + "$3");
                return "webpack:///" + resourcePath;
            }
        },
        module: {
            loaders: loaders
        },
        convertOptions: {
            outputFilename: sysPath.resolve(rootpath, "dist/[name].js")
        }
    }, options);

    webpack(options, function() {
        console.log("\n");
        done.apply(null, arguments);
    });
}

function camelize(str) {
    return str.replace(/-\w/g, hyphenToUpper);
}

function hyphenToUpper(match) {
    return match[1].toUpperCase();
}