const App = require("./app");
const Config = require("../lib/support/config");
const Log = require("../lib/support/log");

const { app: { http: { port } } } = Config;

App.listen(port, () => {
    Log("INFO", `server was running on ${ port } port`);
});