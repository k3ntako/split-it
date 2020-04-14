import IPage from './IPage';
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

  async display(): Promise<IPage | null> {
    this.userIO.clear();
    const users: IUser[] = await userTable.getAll();

    this.userIO.clear();
    const otherUser: IUser | undefined = await this.getPerson(users);

    if (!otherUser) {
      throw Error('The other user cannot be undefined.')
    }

    this.userIO.clear();
    const name: string = await this.getName();

    this.userIO.clear();
    const date: Date = await this.getDate();

    this.userIO.clear();
    const userPaid: boolean = await this.getUserPaid();

    this.userIO.clear();
    const cost: number = await this.getCost();

    const lender: IUser = userPaid ? this.user : otherUser;
    const borrower: IUser = userPaid ? otherUser : this.user;

    await transactionTable.create(lender.id, borrower.id, name, date, cost);

    return null;
  }

  private async getPerson(users: IUser[]): Promise<IUser | undefined> {
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
