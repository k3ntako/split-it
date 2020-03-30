import { v4 as uuidv4 } from 'uuid';
import { IDatabaseIO, IRow, IRowWithoutId } from '../../src/FileIO';

export default class MockFileIO implements IDatabaseIO {
  writeRowArguments: [string, IRowWithoutId][];
  readRowArguments: [string, string][];
  constructor() {
    this.writeRowArguments = [];
    this.readRowArguments = [];
  }

  writeRow(tableName: string, data: IRowWithoutId): IRow {
    this.writeRowArguments.push([tableName, data]);

    return Object.assign({
      id: uuidv4(),
    }, data);
  }

  readRow(tableName: string, id: string): IRow {
    this.readRowArguments.push([tableName, id]);

    return { id };
  }
}