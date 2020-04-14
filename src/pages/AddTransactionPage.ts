import IPage from './IPage';
import { IPrompter } from '../Prompter';
import { IUserIO } from '../CLI';
import { Answers } from 'inquirer';
import { userTable } from '../tables';
import { IUser } from '../tables/UserTable';

export default class AddTransactionPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
  }

  async display(): Promise<IPage | null> {
    this.userIO.clear();
    const users: IUser[] = await userTable.getAll();

    this.userIO.clear();
    const person: Answers = await this.getPerson(users);

    this.userIO.clear();
    const name: Answers = await this.getName();

    this.userIO.clear();
    const date: Answers = await this.getDate();

    this.userIO.clear();
    const userPaid: Answers = await this.getUserPaid();

    this.userIO.clear();
    const cost: Answers = await this.getCost();

    console.log(person, name, date, userPaid, cost);

    return null;
  }

  private async getPerson(users: IUser[]): Promise<Answers> {
    const choices: string[] = users.reduce((acc: string[], user: IUser) => {
      if (user.first_name !== this.user.first_name) {
        return acc.concat(user.first_name);
      }
      return acc;
    }, []);

    return await this.prompter.promptList('Who was this transaction with?', choices);
  }

  private async getName(): Promise<Answers> {
    return await this.prompter.promptInput('What would you like to name this transaction?');
  }

  private async getDate(): Promise<Answers> {
    return await this.prompter.promptDate('When was the transaction?');
  }

  private async getUserPaid(): Promise<Answers> {
    return await this.prompter.promptConfirm('Did you pay for this?');
  }

  private async getCost(): Promise<Answers> {
    return await this.prompter.promptNumber('How much did it cost?');
  }
}
