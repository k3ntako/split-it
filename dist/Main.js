"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./models/User"));
const FileIO_1 = __importDefault(require("./FileIO"));
class Main {
    constructor(cli, prompter) {
        this.cli = cli;
        this.prompter = prompter;
    }
    async start() {
        this.cli.clear();
        this.cli.print('Welcome to Split-it!');
        await this.getPerson();
    }
    async getPerson() {
        const answer = await this.prompter.promptList('Who is this?', ['New Account']);
        if (answer.action === 'New Account') {
            this.cli.clear();
            const nameAnswer = await this.prompter.promptInput('What\'s your name?');
            const name = nameAnswer.input;
            User_1.default.create(name, new FileIO_1.default);
        }
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map