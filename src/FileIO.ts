import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


export interface IFileIO {
  writeRow(tableName: string, data: [] | {}): void;
  readRow(tableName: string, id: string): {} | null;
}

export default class FileIO implements IFileIO{
  private baseDir: string;
  private dbDir: string;

  constructor(){
    this.baseDir = process.cwd();
    this.dbDir = this.baseDir + '/data';
  }

  writeRow(tableName: string, data: {}): any {//change this
    try {
      const tableDir: string = this.dbDir + '/' + tableName + '.json';
      this.createDirIfDoesNotExist();

      const dataWithId = Object.assign({
        id: uuidv4(),
      }, data);

      const tableExists = fs.existsSync(tableDir);
      let tableStr;
      if (!tableExists) {
        tableStr = JSON.stringify([dataWithId]);
      } else {
        const dataStr: string = fs.readFileSync(tableDir, 'utf-8');
        const tableData = JSON.parse(dataStr);
        tableData.push(dataWithId);
        tableStr = JSON.stringify(tableData);
      }

      fs.writeFileSync(tableDir, tableStr, { encoding: 'utf-8', flag: 'w' });

      return dataWithId;
    } catch (error) {
      console.error(error);
    }
  }

  readRow(tableName: string, id: string): {} | null {
    const tableDir: string = this.dbDir + '/' + tableName + '.json';
    const tableExists: boolean = fs.existsSync(tableDir);

    if (!tableExists) {
      return null;
    }

    const tableStr: string = fs.readFileSync(tableDir, 'utf-8');
    const tableData: any[] = JSON.parse(tableStr);
    return tableData.find(row => row.id === id) || null;
  }

  private createDirIfDoesNotExist(): void{
    const folderExists: boolean = fs.existsSync(this.dbDir);
    !folderExists && fs.mkdirSync(this.dbDir);
  }
}
