import UserTable from './UserTable'
import Postgres from '../Postgres';

const database = new Postgres;

export const userTable: UserTable = new UserTable(database);