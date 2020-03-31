import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface IObjectWithAny {
  [key: string]: string | number | IObjectWithAny; 
}

export interface IRow extends IObjectWithAny {
  id: string;
}

export interface ITable {
  [key: string]: IRow;
}

export interface IDatabaseIO {
  writeRow(tableName: string, data: IObjectWithAny): IRow;
  readRow(tableName: string, id: string): IRow | null;
  findOne(tableName: string, where: {}): IRow | null;
}

export default class FileIO implements IDatabaseIO{
  private baseDir: string;
  private dbDir: string;

  constructor(databaseFolder: string = '/data'){
    this.baseDir = process.cwd();
    this.dbDir = this.baseDir + databaseFolder;
  }

  writeRow(tableName: string, data: IObjectWithAny): IRow {
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

  findOne(tableName: string, where: IObjectWithAny): IRow | null {
    const tableData = this.readTable(tableName);

    const keys: false | string[] = where && Object.keys(where);

    if (!keys || !keys.length) {
      throw new Error('You must pass in at least one attribute');
    }

    let rowData: IRow | null = null;
    for(const id in tableData) {
      const row: IRow = tableData[id];
      const isAMatch = keys.every(key => {
        if (typeof where[key] === 'object') {
          return this.advancedCompare(key, row, where);
        } else {
          return row[key] === where[key];
        }
      });

      if (isAMatch) {
        rowData = row;
        break;
      }
    }

    return rowData;
  };

  private advancedCompare(key: string, row: IRow, where: IObjectWithAny): boolean {
    const rowValue = row[key];
    const whereForValue = where[key];

    const queryType = Object.keys(whereForValue)[0];
    if (queryType === 'ILIKE'){
      if (typeof rowValue === 'string' && typeof whereForValue['ILIKE'] === 'string'){
        return rowValue.toLowerCase() === whereForValue.ILIKE.toLowerCase();
      } else {
        throw new Error('ILIKE can only be used on strings');
      }
    }

    return false;
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
