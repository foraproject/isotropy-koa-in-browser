import Server from "./server";

const createServer = function(requestListener, app) {
    return new Server(requestListener, app);
};

export default {
    createServer
};
