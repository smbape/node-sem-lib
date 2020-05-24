const isNumeric = require("./isNumeric");

/**
 * Value of parsed interger or default value if not a number or < 0
 * @param  {Any} num value to parse
 * @param  {Interger} _default default value
 * @return {Interger} parsing result
 */
const toInteger = (num, positive, _default) => {
    if (!isNumeric(num)) {
        return _default;
    }

    if (num === Number.POSITIVE_INFINITY) {
        return num;
    }

    if (num === Number.NEGATIVE_INFINITY) {
        return positive ? _default : num;
    }

    num = parseInt(num, 10);

    return positive && num < 0 ? _default : num;
};

module.exports = toInteger;
