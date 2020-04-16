import UserTable from './UserTable'
import Postgres from '../Postgres';
import TransactionTable from './TransactionTable';

const database = new Postgres;

export const end = database.end;

export const userTable: UserTable = new UserTable(database);
export const transactionTable: TransactionTable = new TransactionTable(database);