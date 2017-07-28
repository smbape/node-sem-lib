var sysPath = require("path");
var _ = require("lodash");
var istanbul = require("istanbul");
_.extend(require("istanbul-combine/node_modules/istanbul"), istanbul);
var combine = require("istanbul-combine");

var opts = {
    dir: sysPath.join(__dirname, "..", "coverage", "combined"),
    base: sysPath.join(__dirname, "..", "src"),
    pattern: sysPath.join(__dirname, "..", "coverage", "*", "coverage-final.json").replace(/\\/g, "/"), // json reports to be combined 
    print: "summary", // print to the console (summary, detail, both, none) 
    reporters: {
        html: { /* html reporter options */ },
        json: { /* etc. */ }
    }
};

require("rimraf")(opts.dir, function(err) {
    if (err) {
        throw err;
    }

    combine(opts, function(err) {
        console.log("done combine");
    });
});