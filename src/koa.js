/* @flow */

import context from "./context";
import request from "./request";
import response from "./response";
import cookies from "./cookies";
import http from "./http";
import util from "./util";
import server from "./server";

import Emitter from 'events';
import compose from 'koa-compose';
import statuses from 'statuses';
import accepts from 'accepts';
import Stream from 'stream';
import only from 'only';

class Application extends Emitter {
  proxy: boolean = false;
  middleware: Array<KoaMiddlewareType> = [];


  constructor() {
    super();

    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.listening = false;
  }


  listen() {
    this.composedMiddleware = compose(this.middleware);
    if (!this.listeners('error').length) this.on('error', this.onerror);
    this.listening = true;
    return server.listen.apply(server, arguments);
  }


  /**
  * Return JSON representation.
  * We only bother showing settings.
  *
  * @return {Object}
  * @api public
  */

  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }

  /**
  * Inspect implementation.
  *
  * @return {Object}
  * @api public
  */

  inspect() {
    return this.toJSON();
  }

  /**
  * Use the given middleware `fn`.
  *
  * @param {Function} fn
  * @return {Application} self
  * @api public
  */

  use(fn) {
    this.middleware.push(fn);
    return this;
  }


  _createAnchor(url) {
    var a = document.createElement("a");
    a.href = url;
    return a;
  }


  httpGet(url) {
    const anchor = _createAnchor(url);

    const request = {};
    request.url = url;
    request.method = "GET";
    request.path = anchor.pathname;
    request.host = anchor.host;
    request.hostname = anchor.hostname;
    request.protocol = location.protocol;
    request.search = anchor.search;

    return runMiddleware(request, {});
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

  /**
  * Return a request handler callback
  * for node's native http server.
  *
  * @return {Function}
  * @api public
  */

  runMiddleware(req, res) {
    res.statusCode = 404;
    const ctx = this.createContext(req, res);
    onFinished(res, ctx.onerror);
    return this.composedMiddleware(ctx).then(() => respond(ctx)).catch(ctx.onerror);
  }

  /**
  * Initialize a new context.
  *
  * @api private
  */

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.onerror = context.onerror.bind(context);
    context.originalUrl = request.originalUrl = req.url;
    context.cookies = new Cookies(req, res, this.keys);
    context.accept = request.accept = accepts(req);
    context.state = {};
    return context;
  }

  /**
  * Default error handler.
  *
  * @param {Error} err
  * @api private
  */

  onerror(err) {
    assert(err instanceof Error, `non-error thrown: ${err}`);

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }

};

/**
* Response helper.
*/

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (res.headersSent || !ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (isJSON(body)) ctx.length = Buffer.byteLength(JSON.stringify(body));
    return res.end();
  }

  // status body
  if (null == body) {
    ctx.type = 'text';
    body = ctx.message || String(code);
    ctx.length = Buffer.byteLength(body);
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  ctx.length = Buffer.byteLength(body);
  res.end(body);
}

export default Application;
