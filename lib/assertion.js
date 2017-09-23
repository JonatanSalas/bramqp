const assert = require('assert');

class Assertions {
    static assertLookup = {
        'length': (data, assertion) => data.length <= parseInt(assertion.value, 10),
        'regexp': (data, assertion) => new RegExp(assertion.value).test(data),
        'notnull': (data, assertion) => !!data,
        'null': (data, assertion) => !data,
        'ne': (data, assertion) => data !== parseInt(assertion.value, 10),
        'syntax': (data, assertion) => assertion.rule === 'path' ? new RegExp('^(|/[^/]*)$').test(data) : false
        // le, enum
    };

    static checkAssertion(data, assertion) {
        if (this.assertLookup[assertion.check]) {
            assert(this.assertLookup[assertion.check](data, assertion));
        }
    }
}

module.exports = Assertions;