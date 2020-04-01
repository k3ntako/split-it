import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import comparers, { IComparer } from './comparers';

export interface IData {
  [key: string]: string | number; 
}

export interface IRow extends IData {
  id: string;
}

export interface ITable {
  [key: string]: IRow;
}

export interface IAdvancedWhere {
  [key: string]: string | undefined;
  ILIKE?: string;
}

export interface IWhere {
  [key: string]: string | IAdvancedWhere;
}

export interface IDatabaseIO {
  writeRow(tableName: string, data: IData): IRow;
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

  writeRow(tableName: string, data: IData): IRow {
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

  findOne(tableName: string, where: IWhere): IRow | null {
    const tableData = this.readTable(tableName);

    const fields = this.getFieldsOnWhere(where);

    let rowData: IRow | null = null;
    for(const id in tableData) {
      const row: IRow = tableData[id];      
      const isAMatch = fields.every(field => {
        const rowValue = row[field];
        const whereForField = where[field];

        if (typeof whereForField === 'object') {          
          return this.advancedCompare(rowValue, whereForField);
        } else {
          return rowValue === whereForField;
        }
      });

      if (isAMatch) {
        rowData = row;
        break;
      }
    }

    return rowData;
  };

  private getFieldsOnWhere(where: IWhere): string[] {
    const fields: false | string[] = where && Object.keys(where);

    if (!fields || !fields.length) {
      throw new Error('You must pass in at least one attribute');
    }

    return fields;
  }

  private advancedCompare(rowValue: string | number, whereForField: IAdvancedWhere): boolean {
    return Object.keys(whereForField).every(comparisonType => {
      const comparer: IComparer = comparers[comparisonType];
      const queryValue: string | undefined = whereForField[comparisonType];

      if (!comparer ) {
        throw new Error(`${comparisonType} is not a comparer.`);
      } else if (queryValue === undefined){
        throw new Error(`Value for ${comparisonType} cannot be undefined.`);
      }

      const isValid = comparer.validate(rowValue, queryValue);
      return isValid && comparer.compare(rowValue, queryValue);
    });
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
