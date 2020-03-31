import { IDatabaseIO } from '../FileIO';

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
    const user = io.writeRow('users', { name });

    return new User(user.id, name);
  }
}