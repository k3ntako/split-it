"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Prompter {
    constructor(cli) {
        this.cli = cli;
    }
    async promptList(message, choices) {
        return this.cli.prompt({});
    }
}
exports.default = Prompter;
//# sourceMappingURL=PromptPreparer.js.map