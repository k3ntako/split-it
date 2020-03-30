"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./models/User"));
class Main {
    constructor(userIO, databaseIO, prompter) {
        this.userIO = userIO;
        this.databaseIO = databaseIO;
        this.prompter = prompter;
    }
    async start() {
        this.userIO.clear();
        this.userIO.print('Welcome to Split-it!');
        await this.getPerson();
    }
    async getPerson() {
        const answer = await this.prompter.promptList('Who is this?', ['New Account']);
        if (answer.action === 'New Account') {
            this.userIO.clear();
            const nameAnswer = await this.prompter.promptInput('What\'s your name?');
            const name = nameAnswer.input;
            User_1.default.create(name, this.databaseIO);
        }
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map