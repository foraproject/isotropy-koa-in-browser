(function() {
    "use strict";

    var util = require("./util");

    var NativeResponse = function(params) {
        util.assign(this, "method", params);
        util.assign(this, "url", params);
        util.assign(this, "headers", params);
    };

    module.exports = NativeResponse;
})();
