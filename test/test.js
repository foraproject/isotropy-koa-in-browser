var should = require("should");
var koa = require("../lib/application");

describe("Koa-In-Browser", function() {

    var makeRequest = (host, port, path, method, headers, _postData) => {
        return new Promise((resolve, reject) => {
            var postData = (typeof _postData === "string") ? _postData : querystring.stringify(_postData);
            var options = { host, port, path, method, headers };

            var result = "";
            var req = http.request(options, function(res) {
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
        var app = new koa();
        koa.listen();
    });

});
