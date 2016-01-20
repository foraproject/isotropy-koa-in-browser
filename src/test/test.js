import __polyfill from "babel-polyfill";
import should from "should";
import koa from "../koa";
import jsdom from "jsdom";

describe("Koa-In-Browser", () => {

  const HTML = `
  <html>
    <body>
      <div id="isotropy-container">
      </div>
    </body>
  </html>
  `;

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

  it("Must listen on a port", async () => {
    //Load html in jsdom
    GLOBAL.document = jsdom.jsdom(HTML, { url: "http://www.example.com" });
    GLOBAL.window = GLOBAL.document.defaultView;
    GLOBAL.location = GLOBAL.window.location;
    GLOBAL.history = GLOBAL.window.history;

    const app = new koa();
    app.listen();
    app.listening.should.be.true();
  });

  it("Must respond to page load event", async () => {
    GLOBAL.document = jsdom.jsdom(HTML, { url: "http://www.example.com" });
    GLOBAL.window = GLOBAL.document.defaultView;
    GLOBAL.location = GLOBAL.window.location;
    GLOBAL.history = GLOBAL.window.history;

    let called = false;
    const server = new koa();
    server.use(async () => {
      called = true;
    });
    server.listen();
    called.should.be.true();
  });

});
