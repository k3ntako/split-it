import UserTable from './UserTable'
import Postgres, { IDatabase } from '../Postgres';

export interface ITable {
  userTable: UserTable;
}

const t: any = {};

export function init(database: IDatabase) {
  t.userTable = new UserTable(database);
}

init(new Postgres);

const tables: ITable = t;
export default tables;