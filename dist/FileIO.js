"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const isTest = process.env.NODE_ENV === 'test';
const databaseFolder = isTest ? '/test/data' : '/data';
class FileIO {
    constructor() {
        this.baseDir = process.cwd();
        this.dbDir = this.baseDir + databaseFolder;
    }
    writeRow(tableName, data) {
        try {
            const tableDir = this.dbDir + '/' + tableName + '.json';
            this.createDirIfDoesNotExist();
            const id = uuid_1.v4();
            const dataWithId = Object.assign({ id }, data);
            const tableData = this.readTable(tableName) || {};
            tableData[id] = dataWithId;
            const tableStr = JSON.stringify(tableData);
            fs_1.default.writeFileSync(tableDir, tableStr, { encoding: 'utf-8', flag: 'w' });
            return dataWithId;
        }
        catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
    readRow(tableName, id) {
        const tableData = this.readTable(tableName);
        if (!tableData) {
            return null;
        }
        return tableData[id] || null;
    }
    readTable(tableName) {
        const tableDir = this.dbDir + '/' + tableName + '.json';
        const tableExists = fs_1.default.existsSync(tableDir);
        if (!tableExists) {
            return null;
        }
        const tableStr = fs_1.default.readFileSync(tableDir, 'utf-8');
        return JSON.parse(tableStr);
    }
    createDirIfDoesNotExist() {
        const folderExists = fs_1.default.existsSync(this.dbDir);
        !folderExists && fs_1.default.mkdirSync(this.dbDir);
    }
}
exports.default = FileIO;
//# sourceMappingURL=FileIO.js.map