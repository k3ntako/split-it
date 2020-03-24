"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const Main_1 = require("./Main");
const CLI_1 = require("./CLI");
const cli = new CLI_1.default();
const main = new Main_1.default(cli);
const app = new App_1.default(main);
app.start();
//# sourceMappingURL=index.js.map