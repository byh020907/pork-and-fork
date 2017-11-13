const App = require("./app");
const Config = require("../lib/support/config");
const Log = require("../lib/support/log");

const { port } = Config.app.http;

App.listen(port, () => {
    Log("INFO", `server was running on ${ port } port`);
});