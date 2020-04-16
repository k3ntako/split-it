import IPage from './IPage';
import MenuPage from './MenuPage';
import { IPrompter } from '../Prompter';
import { IUserIO } from '../CLI';
import { Answers } from 'inquirer';
import { userTable, transactionTable } from '../tables';
import { IUser } from '../tables/UserTable';
import chalk from 'chalk';

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
    this.clearAndDisplayTitle();
    const otherUser: IUser | undefined = await this.getUser();

    if (!otherUser) {
      throw Error('The other user cannot be undefined.')
    }

    const name: string = await this.getName();
    const date: Date = await this.getDate();
    const userPaid: boolean = await this.getUserPaid();
    const cost: number = await this.getCost();

    const lender: IUser = userPaid ? this.user : otherUser;
    const borrower: IUser = userPaid ? otherUser : this.user;

    await transactionTable.create(lender.id, borrower.id, name, date, cost);

    return new MenuPage(this.userIO, this.prompter, this.user);
  }

  private clearAndDisplayTitle(): void {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Add a Transaction\n'));
  }

  private async getUser(): Promise<IUser | undefined> {
    this.clearAndDisplayTitle();

    const users: IUser[] = await userTable.getAll();

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
    this.clearAndDisplayTitle();

    let name: string = '';
    while (true) {
      const answer: Answers = await this.prompter.promptInput('Name the transaction:');
      name = answer.input;

      if (name && name.trim()) {
        break;
      }

      this.clearAndDisplayTitle();
      this.userIO.print('Invalid name, please try again!');
    }

    return name;
  }

  private async getDate(): Promise<Date> {
    this.clearAndDisplayTitle();

    const answer: Answers = await this.prompter.promptDate('When was the transaction?');
    return answer.date;
  }

  private async getUserPaid(): Promise<boolean> {
    this.clearAndDisplayTitle();

    const answer: Answers = await this.prompter.promptConfirm('Did you pay for this?');
    return answer.confirmation;
  }

  private async getCost(): Promise<number> {
    this.clearAndDisplayTitle();

    let cost: number = NaN;
    while (true) {
      const answer: Answers = await this.prompter.promptNumber('How much did it cost?');
      cost = answer.number;

      if (!isNaN(cost) && cost > 0 && !(cost * 100 % 1)) {
        break;
      }

      this.clearAndDisplayTitle();
      this.userIO.print('Invalid cost, please enter a positive number with at most two decimal places!');
    }

    return cost;
  }
}
