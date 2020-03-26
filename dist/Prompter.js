"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Prompter {
    constructor(cli) {
        this.cli = cli;
    }
    async promptList(message, choices) {
        const options = [{
                type: 'list',
                name: 'action',
                message,
                choices,
            }];
        return await this.cli.prompt(options);
    }
    async promptInput(message) {
        const options = [{
                type: 'input',
                name: 'input',
                message,
            }];
        return await this.cli.prompt(options);
    }
}
exports.default = Prompter;
//# sourceMappingURL=Prompter.js.map