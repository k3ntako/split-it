import { v4 as uuidv4 } from 'uuid';
import { IDatabaseIO, IRow, IObjectWithAny } from '../../src/FileIO';

export default class MockFileIO implements IDatabaseIO {
  writeRowArguments: [string, IObjectWithAny][];
  readRowArguments: [string, string][];
  findOneArguments: [string, IObjectWithAny][];
  constructor() {
    this.writeRowArguments = [];
    this.readRowArguments = [];
    this.findOneArguments = [];
  }

  writeRow(tableName: string, data: IObjectWithAny): IRow {
    this.writeRowArguments.push([tableName, data]);

    return Object.assign({
      id: uuidv4(),
    }, data);
  }

  readRow(tableName: string, id: string): IRow {
    this.readRowArguments.push([tableName, id]);

    return { id };
  }

  findOne(tableName: string, where: {}): IRow  {
    this.findOneArguments.push([tableName, where]);

    return Object.assign({ 
      id: uuidv4(),
    }, where);
  };

}