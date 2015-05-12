(function() {
    "use strict";

    var isDefined = function(val) {
        return (typeof val !== "undefined" && val !== null);
    };

    var assign = function(target, name, source, required) {
        required = isDefined(required) ? required : true;
        if (isDefined(source[name])) {
            target[name] = source[name];
        } else {
            if (required) {
                throw new Error(name + " is required to make a native target.");
            }
        }
    };

    var printNotImplemented = function(method) {
        console.log("The method or property '" + method + "' is not implemented on the client.");
    };

    module.exports = {
        isDefined: isDefined,
        assign: assign,
        printNotImplemented: printNotImplemented
    };

})();
