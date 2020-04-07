import { IPostgresIO } from '../PostgresIO';

export interface IUser {
  id: string;
  name: string;
}

export default class User implements IUser {
  id: string;
  name: string;
  constructor(id: string, name: string){
    this.id = id;
    this.name = name;
  }

  static async create(name: string, postgresIO: IPostgresIO): Promise<IUser> {
    name = name && name.trim();

    await User.validate(name, postgresIO);

    const user = await postgresIO.createUser(name);

    return new User(user.id, name);
  }

  static async validate(name: string, postgresIO: IPostgresIO){
    if (!name) {
      throw new Error('Name cannot be blank');
    }

    const existingUser: any = await postgresIO.findUserByName(name);

    if (existingUser) {
      throw new Error(`The name, ${name}, is already taken.`);
    }
  }
}
