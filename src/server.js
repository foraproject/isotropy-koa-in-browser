
import libReqRes from "isotropy-request-response-in-browser";
const NativeRequest = libReqRes.Request;
const NativeResponse = libReqRes.Response;

class Dispatcher {
    servers = [];

    add(host, port, server) {
        this.servers.push({ host, port, server});
    }

    get(host, port) {
        const server = this.servers.filter(s => s.host === host && s.port === port);
        return server.length ? server[0] : null;
    }
}

class Server {

    constructor(requestListener, app) {
        this.requestListener = requestListener;
        this.app = app;

        if (!window.__koa_in_browser) {
            const dispatcher = new Dispatcher();
            window.__koa_dispatcher = dispatcher;
        }
        this.dispatcher = window.__koa_dispatcher;
    }


    listen(host, port) {
        this.host = host;
        this.port = port;
        this.dispatcher.add(host, port, this);
    }

    /*
    Handle a request coming via PageJS client-side routing mechanism
    The incoming context will be a PageJS context, which needs to be converted to a KoaJS context.
    */
    handlePageJSRequest(pageJSContext) {
        var req = new NativeRequest({
            method: "GET",
            url: pageJSContext.path,
            headers: {}
        });
        var res = new NativeResponse();
        this.requestListener.call(this.app, req, res);
    }


    /*
    Handle a request coming via PageJS client-side routing mechanism
    The incoming context will be a PageJS context, which needs to be converted to a KoaJS context.
    */
    handleIsotropyXMLHttpRequest(request) {
        var req = new NativeRequest({
            method: request.method,
            url: request.url,
            headers: request.requestHeaders || {}
        });

        //koa will use lower case for these headers
        if (request.requestHeaders["Content-Type"]) {
            req.headers["content-type"] = request.requestHeaders["Content-Type"];
        }


        var res = new NativeResponse();
        this.requestListener.call(this.app, req, res);

        req.emit("data", request.requestBody);
        req.emit("end");

        var self = this;
        res.on("end", function(body) {
            request.respond(self.status, self.headers, body);
        });
    };

}

export default Server;
