(function() {
    "use strict";

    var isDefined = function(val) {
        return (typeof val !== "undefined" && val !== null);
    };

    var assign = function(request, name, params, required) {
        required = isDefined(required) ? required : true;
        if (isDefined(params[name])) {
            request[name] = params[name];
        } else {
            if (required) {
                throw new Error(name + " is required to make a native request.");
            }
        }
    };

    var NativeRequest = function(params) {
        assign(this, "method", params);
        assign(this, "headers", params);
        assign(this, "url", params);
    };

    module.exports = NativeRequest;
})();
