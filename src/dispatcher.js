/* @flow */
import Server from "./server";

class Dispatcher {
  servers: Array<Server> = [];

  add(port: string, host: string, server: Server) {
    this.servers.push({ host, port, server});
  }

  get(port: string, host: string) {
    const server = this.servers.filter(s => s.host === host && s.port === port);
    return server.length ? server[0] : null;
  }

  remove(port: string, host: string) {
    this.servers = this.servers.filter(s => s.host !== host || s.port !== port);
  }
}
