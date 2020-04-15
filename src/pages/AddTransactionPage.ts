import IPage from './IPage';
import MenuPage from './MenuPage';
import { IPrompter } from '../Prompter';
import { IUserIO } from '../CLI';
import { Answers } from 'inquirer';
import { userTable, transactionTable } from '../tables';
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

  async display(): Promise<IPage> {
    this.userIO.clear();
    const users: IUser[] = await userTable.getAll();

    this.userIO.clear();
    const otherUser: IUser | undefined = await this.getUser(users);

    if (!otherUser) {
      throw Error('The other user cannot be undefined.')
    }

    let name: string = '';
    while (!name || !name.trim()) {
      name = await this.getName();
    }

    const date: Date = await this.getDate();

    const userPaid: boolean = await this.getUserPaid();

    let cost: number = NaN;
    while (isNaN(cost) || cost <= 0 || (cost * 100 % 1)) {
      cost = await this.getCost();
    }

    const lender: IUser = userPaid ? this.user : otherUser;
    const borrower: IUser = userPaid ? otherUser : this.user;

    await transactionTable.create(lender.id, borrower.id, name, date, cost);

    return new MenuPage(this.userIO, this.prompter, this.user);
  }

  private async getUser(users: IUser[]): Promise<IUser | undefined> {
    const choices: string[] = users.reduce((acc: string[], user: IUser) => {
      if (user.first_name !== this.user.first_name) {
        return acc.concat(user.first_name);
      }
      return acc;
    }, []);

    const answer: Answers = await this.prompter.promptList('Who was this transaction with?', choices);
    return users.find(user => user.first_name === answer.action);
  }

  private async getName(): Promise<string> {
    const answer: Answers = await this.prompter.promptInput('What would you like to name this transaction?');
    return answer.input;
  }

  private async getDate(): Promise<Date> {
    const answer: Answers = await this.prompter.promptDate('When was the transaction?');
    return answer.date;
  }

  private async getUserPaid(): Promise<boolean> {
    const answer: Answers = await this.prompter.promptConfirm('Did you pay for this?');
    return answer.confirmation;
  }

  private async getCost(): Promise<number> {
    const answer: Answers = await this.prompter.promptNumber('How much did it cost?');
    return answer.number;
  }
}
