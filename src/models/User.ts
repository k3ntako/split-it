import { IDatabaseIO, IRow } from '../FileIO';

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

  static create(name: string, io: IDatabaseIO): User {
    name = name && name.trim();
    User.validate(name, io);

    const user = io.writeRow('users', { name });

    return new User(user.id, name);
  }

  static validate(name: string, io: IDatabaseIO){
    name = name && name.trim();
    if (!name) {
      throw new Error('Name cannot be blank');
    }

    const existingUser: IRow | null = io.findOne('users', { 
      name: { ILIKE: name }
    });
    if (existingUser) {
      throw new Error(`The name, ${name}, is already taken.`);
    }
  }
}
