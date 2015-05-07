(function() {

    "use strict";

    var Server = function(requestListener) {
        this.requestListener = requestListener;
        window.__koa_in_browser_endpoints = window.__koa_in_browser_endpoints || [];
        window.__koa_in_browser_endpoints.push(this);
    };


    Server.prototype.listen = function(host, port) {
        this.host = host;
        this.port = port;
    };


    module.exports = Server;

})();
