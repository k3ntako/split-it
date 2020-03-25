"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            await this.prompter.promptInput('What\'s your name?');
        }
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map