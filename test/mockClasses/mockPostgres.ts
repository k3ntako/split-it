import { IDatabase } from '../../src/Postgres';
import { IUser } from '../../src/models/UserTable';

export default class MockPostgres implements IDatabase {
  createUserArguments: string[];
  findUserByNameArguments: string[];
  constructor() {
    this.createUserArguments = [];
    this.findUserByNameArguments = [];
  }

  getConfig(env: string): {}{
    return {
      driver: "mock_" + env,
      user: null,
      password: null,
      host: "localhost",
      database: "split_it_test",
      port: "5432"
    };
  }

  async createUser(name: string): Promise<IUser>{
    this.createUserArguments.push(name);

    return {
      id: this.createUserArguments.length,
      name,
    }
  }

  async findUserByName(name: string): Promise<IUser | null> {
    this.findUserByNameArguments.push(name);

    const id = this.createUserArguments.indexOf(name) + 1;

    return id ? { id, name } : null;
  }

}