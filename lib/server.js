(function() {

    "use strict";

    var NativeRequest = require("./native-request");
    var NativeResponse = require("./native-response");

    var Server = function(requestListener, app) {
        this.requestListener = requestListener;
        this.app = app;
        window.__koa_in_browser = this;
    };


    Server.prototype.listen = function(host, port) {
        this.host = host;
        this.port = port;
    };


    /*
        Handle a request coming via PageJS client-side routing mechanism
        The incoming context will be a PageJS context, which needs to be converted to a KoaJS context.
    */
    Server.prototype.handlePageJSRequest = function(pageJSContext) {
        var req = new NativeRequest({
            method: "GET",
            url: pageJSContext.path,
            headers: {}
        });
        var res = new NativeResponse();
        this.requestListener.call(this.app, req, res);
    };


    /*
        Handle a request coming via PageJS client-side routing mechanism
        The incoming context will be a PageJS context, which needs to be converted to a KoaJS context.
    */
    Server.prototype.handleIsotropyXMLHttpRequest = function(request) {
        console.log(request);
        var req = new NativeRequest({
            method: request.method,
            url: request.url,
            headers: request.requestHeaders,
            body: request.requestBody
        });
        var res = new NativeResponse();
        this.requestListener.call(this.app, req, res);
    };


    module.exports = Server;

})();
