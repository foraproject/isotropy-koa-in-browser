(function() {

    "use strict";

    var Server = require("./server");

    var createServer = function(requestListener) {
        return new Server(requestListener);
    };

    module.exports = {
        createServer: createServer
    };

})();
