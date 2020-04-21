import UserTable from './UserTable';
import PG_Interface from '../PG_Interface';
import TransactionTable from './TransactionTable';
import PostgresQuery from '../PostgresQuery';

const database = new PG_Interface();
const databaseQuery = new PostgresQuery(database);

export const end = database.end;

export const userTable: UserTable = new UserTable(databaseQuery);
export const transactionTable: TransactionTable = new TransactionTable(databaseQuery);
