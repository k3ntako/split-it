import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface IRowWithoutId {
  [key: string]: string | number;
}

export interface IRow extends IRowWithoutId {
  id: string;
}

export interface ITable {
  [key: string]: IRow;
}

export interface IDatabaseIO {
  writeRow(tableName: string, data: IRowWithoutId): IRow;
  readRow(tableName: string, id: string): IRow | null;
}

export default class FileIO implements IDatabaseIO{
  private baseDir: string;
  private dbDir: string;

  constructor(databaseFolder: string = '/data'){
    this.baseDir = process.cwd();
    this.dbDir = this.baseDir + databaseFolder;
  }

  writeRow(tableName: string, data: IRowWithoutId): IRow {
    try {
      const tableDir: string = this.dbDir + '/' + tableName + '.json';
      this.createDirIfDoesNotExist();

      const id: string = uuidv4();
      const dataWithId: IRow = Object.assign({ id }, data);

      const tableData: ITable | null = this.readTable(tableName) || {};
      tableData[id] = dataWithId;
      
      const tableStr: string = JSON.stringify(tableData); 
      fs.writeFileSync(tableDir, tableStr, { encoding: 'utf-8', flag: 'w' });

      return dataWithId;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  readRow(tableName: string, id: string): IRow | null {
    const tableData: ITable | null = this.readTable(tableName);
    
    if (!tableData) {
      return null;
    }

    return tableData[id] || null;
  }

  private readTable(tableName: string): ITable | null {
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
