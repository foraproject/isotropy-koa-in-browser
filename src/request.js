/* @flow */

import parse from "parseurl";
import urlModule from "url";
import qs from "querystring";

const stringify = urlModule.stringify;

class Request {

  constructor({ request, originalUrl }) {
    this.req = request;
    this.originalUrl = originalUrl;
  }

  get headers() {
    return this.req.headers;
  }


  get url() {
    return this.req.url;
  }
  set url(val) {
    this.req.url = val;
  }


  get method() {
    return this.req.method;
  }
  set method(val) {
    this.req.method = val;
  }


  get path() {
    return parse(this.req).pathname;
  }

  set path(path) {
    const url = parse(this.req);
    url.pathname = path;
    url.path = null;

    this.url = stringify(url);
  }


  get query() {
    const str = this.querystring;
    if (!str) return {};

    const c = this._querycache = this._querycache || {};
    return c[str] || (c[str] = qs.parse(str));
  }
  set query(obj) {
    this.querystring = qs.stringify(obj);
  }


  get querystring() {
    return parse(this.req).query || '';
  }
  set querystring(str) {
    const url = parse(this.req);
    url.search = str;
    url.path = null;

    this.url = stringify(url);
  }


  get search() {
    if (!this.querystring) return '';
    return '?' + this.querystring;
  }
  set search(str) {
    this.querystring = str;
  }


  get statusCode() {
    return this.req.statusCode;
  }
  set statusCode(val) {
    this.req.statusCode = val;
  }


  get statusMessage() {
    return this.req.statusMessage;
  }
  set statusMessage(val) {
    this.req.statusMessage = val;
  }


  get url() {
    return this.req.url;
  }
  set url(val) {
    this.req.url = url;
  }


  inspect() {
    if (!this.req) return;
    return this.toJSON();
  }


  toJSON() {
    return {
      method: this.method,
      url: this.url,
      header: this.header
    };
  }
}

export default Request;
