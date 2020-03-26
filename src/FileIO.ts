import fs from 'fs';
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

      let tableData = this.readTable(tableName);

      if (!tableData) {
        tableData = [dataWithId];
      } else {        
        tableData.push(dataWithId);
      }
      
      const tableStr = JSON.stringify(tableData);
      fs.writeFileSync(tableDir, tableStr, { encoding: 'utf-8', flag: 'w' });

      return dataWithId;
    } catch (error) {
      console.error(error);
    }
  }

  readRow(tableName: string, id: string): {} | null {
    const tableData: any[] = this.readTable(tableName);
    
    if (!tableData) {
      return null;
    }

    return tableData.find(row => row.id === id) || null;
  }

  private readTable(tableName: string): any{
    const tableDir: string = this.dbDir + '/' + tableName + '.json';

    const tableExists: boolean = fs.existsSync(tableDir);

    if (!tableExists) {
      return null;
    }

    const tableStr: string = fs.readFileSync(tableDir, 'utf-8');
    return JSON.parse(tableStr);
  }

  private createDirIfDoesNotExist(): void{
    const folderExists: boolean = fs.existsSync(this.dbDir);
    !folderExists && fs.mkdirSync(this.dbDir);
  }
}
