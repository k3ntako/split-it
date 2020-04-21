import { IDatabase } from '../PostgresQuery';

export interface IUser {
  id: number;
  first_name: string;
}

export interface IUserTable {
  create(firstName: string): Promise<IUser>;
  findByName(firstName: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
}

export default class UserTable implements IUserTable {
  private databaseQuery: IDatabase;
  constructor(databaseQuery: IDatabase) {
    this.databaseQuery = databaseQuery;
  }

  async create(firstName: string): Promise<IUser> {
    firstName = firstName && firstName.trim();
    firstName = this.titleCase(firstName);

    await this.validate(firstName);

    const users = await this.databaseQuery.insert('users', {
      first_name: firstName,
    });

    return users[0];
  }

  private async validate(firstName: string) {
    if (!firstName) {
      throw new Error('Name cannot be blank');
    }

    const existingUser: IUser | null = await this.findByName(firstName);

    if (existingUser) {
      throw new Error(`The name, ${firstName}, is already taken.`);
    }
  }

  async findByName(firstName: string): Promise<IUser | null> {
    const users = await this.databaseQuery.select('users', { first_name: firstName });
    return users[0];
  }

  private titleCase(firstName: string): string {
    return firstName
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
      .join(' ');
  }

  async getAll(): Promise<IUser[]> {
    return await this.databaseQuery.select('users', {});
  }
}
