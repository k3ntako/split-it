import { v4 as uuidv4 } from 'uuid';
import { IDatabaseIO, IRow, IWhere, IData } from '../../src/FileIO';

export default class MockFileIO implements IDatabaseIO {
  writeRowArguments: [string, IRow][];
  readRowArguments: [string, string][];
  findOneArguments: [string, IWhere][];
  constructor() {
    this.writeRowArguments = [];
    this.readRowArguments = [];
    this.findOneArguments = [];
  }

  writeRow(tableName: string, data: IData): IRow {
    const dataWithId: IRow = Object.assign({
      id: uuidv4(),
    }, data);

    this.writeRowArguments.push([tableName, dataWithId]);

    return dataWithId;
  }

  readRow(tableName: string, id: string): IRow | null {
    this.readRowArguments.push([tableName, id]);

    const existingRow = this.writeRowArguments.find(args => {
      return args[1].id === id;
    });

    return (existingRow && existingRow[1]) || null;
  }

  findOne(tableName: string, where: IWhere): IRow | null {
    this.findOneArguments.push([tableName, where]);

    const keys: false | string[] = where && Object.keys(where);

    if (!keys || !keys.length) {
      throw new Error('You must pass in at least one attribute');
    }

    const writeRowArgument: [string, IRow] | undefined = this.writeRowArguments.find(row => {
      return keys.every((key): boolean => {
        if (typeof where[key] !== 'object' ){
          return row[1][key] === where[key];
        }

        const whereForKey = where[key];
        const rowValue = row[1][key];

        if (typeof whereForKey === 'object' && typeof whereForKey.ILIKE === 'string' && typeof rowValue === 'string') {
          return rowValue.toLowerCase() === whereForKey.ILIKE.toLowerCase();
        }      

        return false;
      });
    });

    return (writeRowArgument && writeRowArgument[1]) || null;
  };

}