/* @flow */

/**
* Module dependencies.
*/
import createError from 'http-errors';
import delegate from 'delegates';
import statuses from 'statuses';
import Request from "./request";
import Response from "./response";

class Context {

  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }
}

export default Context;
