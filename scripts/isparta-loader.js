"use strict";

const loaderUtils = require("loader-utils");
const isparta = require("isparta");

module.exports = function(source, map) {
    let options = this.options.isparta || {
            embedSource: true,
            noAutoWrap: true,
            babel: this.options.babel
        };
    const originalOptions = options;

    const loaderOptions = this.query ? loaderUtils.parseQuery(this.query) : null;
    if (loaderOptions) {
        options = loaderOptions;

        if (options.exclude) {
            const exclude = new RegExp(options.exclude);
            if (exclude.test(this.resourcePath)) {
                this.callback(null, source, map);
                return;
            }
        }

        if (options.include) {
            const include = new RegExp(options.include);
            if (!include.test(this.resourcePath)) {
                this.callback(null, source, map);
                return;
            }
        }

        options = options.instrumenter || originalOptions;
        if (options.babel === "inherit") {
            options.babel = this.options.babel;
        }
    }

    if (this.cacheable) {
        this.cacheable();
    }

    const instrumenter = new isparta.Instrumenter(options);
    return instrumenter.instrumentSync(source, this.resourcePath, map); // eslint-disable-line consistent-return
};