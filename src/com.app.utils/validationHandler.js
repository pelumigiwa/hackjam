var define = require('node-requirejs-define'),
    validator = require('validatorjs');

define(function() {

    function Validator(body, rules, customMessages, callback) {
        const validation = new validator(body, rules, customMessages);
        validation.passes(() => callback(null, true));
        validation.fails(() => callback(validation.errors, false));
    };

    return {
        Validator: Validator
    }

});