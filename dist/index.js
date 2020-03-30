"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const Main_1 = __importDefault(require("./Main"));
const CLI_1 = __importDefault(require("./CLI"));
const Prompter_1 = __importDefault(require("./Prompter"));
const FileIO_1 = __importDefault(require("./FileIO"));
const cli = new CLI_1.default();
const fileIO = new FileIO_1.default();
const prompter = new Prompter_1.default(cli);
const main = new Main_1.default(cli, fileIO, prompter);
const app = new App_1.default(main);
app.start();
//# sourceMappingURL=index.js.map