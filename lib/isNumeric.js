const isNumeric = obj => {
    if (obj === undefined || obj === null || Array.isArray(obj)) {
        return false;
    }

    const parsed = parseFloat(obj);
    if (obj === parsed) {
        return true;
    }

    return obj - parsed + 1 >= 0;
};

module.exports = isNumeric;
