"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clear = require('clear');
const inquirer = require('inquirer');
class CLI {
    constructor() { }
    print(message) {
        console.log(message);
    }
    clear() {
        clear();
    }
    async prompt(questions) {
        return await inquirer.prompt(questions);
    }
}
exports.default = CLI;
//# sourceMappingURL=CLI.js.map