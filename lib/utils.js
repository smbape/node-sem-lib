var Log = Error;
Log.prototype.write = function() {
    // var re = new RegExp('(?:(?:[^\n]+(?:\n|$)){3})[^\n]+at (.+)');
    var re = new RegExp('(?:(?:[^\\n]+(?:\\n|$)){3})[^\\n]+at (?:(.+) \\()(.+)\\\\([^\\n\\\\]+:[0-9]+:[0-9]+)(?:\\)|$)');
    // console.log(re);
    var match = re.exec(this.stack);
    // var prefix = match[1] + ':';
    var prefix = match[1] + '(' + match[3] + ')' + ':';

    var args = Array.prototype.slice.call(arguments, 0);

    if (arguments.length > 1) {
        args[0] = prefix + ' ' + args[0] + '';
    } else {
        args.push(args[0]);
        args[0] = prefix;
    }

    console.log.apply(console, args);
};

function consoleWrite() {
    var log = Log();
    log.write.apply(log, arguments);
}

module.exports = {
    consoleWrite: consoleWrite,

    isNumeric: function isNumeric(obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    isObject: function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }

};