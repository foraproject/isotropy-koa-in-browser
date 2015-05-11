(function() {

    "use strict";

    var Server = require("./server");

    var createServer = function(requestListener, app) {
        return new Server(requestListener, app);
    };

    module.exports = {
        createServer: createServer
    };

})();
