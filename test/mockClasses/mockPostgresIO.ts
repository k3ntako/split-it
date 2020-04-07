import { IPostgresIO } from '../../src/PostgresIO';

export default class MockPostgresIO implements IPostgresIO {
  createUserArguments: string[];
  findUserByNameArguments: string[];
  constructor() {
    this.createUserArguments = [];
    this.findUserByNameArguments = [];
  }

  async createUser(name: string): Promise<any>{
    this.createUserArguments.push(name);

    return {
      id: this.createUserArguments.length,
      name,
    }
  }

  async findUserByName(name: string): Promise<any> {
    this.findUserByNameArguments.push(name);

    const id = this.createUserArguments.indexOf(name) + 1;

    return id ? { id, name } : null;
  }

}