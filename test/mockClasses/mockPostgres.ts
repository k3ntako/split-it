import { IDatabase } from '../../src/Postgres';
import { IUser } from '../../src/models/UserTable';

export default class MockPostgres implements IDatabase {
  createUserArguments: string[];
  findUserByNameArguments: string[];
  constructor() {
    this.createUserArguments = [];
    this.findUserByNameArguments = [];
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