import should from "should";
import koa from "../application";
import jsdom from "jsdom";

describe("Koa-In-Browser", () => {

    const makeRequest = (host, port, path, method, headers, _postData) => {
        return new Promise((resolve, reject) => {
            const postData = (typeof _postData === "string") ? _postData : querystring.stringify(_postData);
            const options = { host, port, path, method, headers };

            let result = "";
            const req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) { result += data; });
                res.on('end', function() { resolve(result); });
            });
            req.on('error', function(e) { reject(e); });
            req.write(postData);
            req.end();
        });
    };

    it("Must listen on a port", function() {
        GLOBAL.window = {};
        const app = new koa();
        app.listen();
    });

});
