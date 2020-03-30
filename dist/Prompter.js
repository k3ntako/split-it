"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Prompter {
    constructor(userIO) {
        this.userIO = userIO;
    }
    async promptList(message, choices) {
        const options = [{
                type: 'list',
                name: 'action',
                message,
                choices,
            }];
        return await this.userIO.prompt(options);
    }
    async promptInput(message) {
        const options = [{
                type: 'input',
                name: 'input',
                message,
            }];
        return await this.userIO.prompt(options);
    }
}
exports.default = Prompter;
//# sourceMappingURL=Prompter.js.map