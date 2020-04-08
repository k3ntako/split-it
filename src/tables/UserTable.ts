import { IDatabase } from '../Postgres';

export interface IUser {
  id: number;
  name: string;
}

export interface IUserTable {
  database: IDatabase;
  create(name: string): Promise<IUser>;
  findByName(name: string): Promise<IUser | null>
}

export default class UserTable implements IUserTable {
  database: IDatabase;
  constructor(database: IDatabase){
    this.database = database;
  }

  async create(name: string): Promise<IUser>{
    name = name && name.trim();
    name = this.titleCase(name);

    await this.validate(name);

    return await this.database.createUser(name);
  }

  async validate(name: string){
    if (!name) {
      throw new Error('Name cannot be blank');
    }

    const existingUser: IUser | null = await this.findByName(name);

    if (existingUser) {
      throw new Error(`The name, ${name}, is already taken.`);
    }
  }

  async findByName(name: string): Promise<IUser | null> {
    return await this.database.findUserByName(name);
  }

  private titleCase(name: string): string {
    return name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');
  }
}
