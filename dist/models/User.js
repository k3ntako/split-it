"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static create(name, io) {
        const user = io.writeRow('users', { name });
        return new User(user.id, name);
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map