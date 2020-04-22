import { IPrompter } from '../../Prompter';
import { IUserIO } from '../../CLI';
import { Answers } from 'inquirer';
import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';

export default class TransactionUserInput {
  prompter: IPrompter;
  userIO: IUserIO;

  constructor(userIO: IUserIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.prompter = prompter;
  }

  private clearAndDisplayTitle = (): void => {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Add a Transaction\n'));
  };

  async getUser(users: IUser[], activeUser: IUser): Promise<IUser | undefined> {
    const choices: string[] = users.reduce((acc: string[], user: IUser) => {
      if (user.first_name !== activeUser.first_name) {
        return acc.concat(user.first_name);
      }
      return acc;
    }, []);

    this.clearAndDisplayTitle();
    const answer: Answers = await this.prompter.promptList('Who was this transaction with?', choices);
    return users.find((user) => user.first_name === answer.action);
  }

  async getName(): Promise<string> {
    this.clearAndDisplayTitle();

    let name: string = '';
    while (true) {
      const answer: Answers = await this.prompter.promptText('Name the transaction:');
      name = answer.input;

      if (name && name.trim()) {
        break;
      }

      this.clearAndDisplayTitle();
      this.userIO.print('Invalid name, please try again!');
    }

    return name;
  }

  async getDate(): Promise<Date> {
    this.clearAndDisplayTitle();

    const answer: Answers = await this.prompter.promptDate('When was the transaction?');
    return answer.date;
  }

  async getUserPaid(): Promise<boolean> {
    this.clearAndDisplayTitle();

    const answer: Answers = await this.prompter.promptConfirm('Did you pay for this?');
    return answer.confirmation;
  }

  async getCost(): Promise<number> {
    this.clearAndDisplayTitle();

    let cost: number = NaN;
    while (true) {
      const answer: Answers = await this.prompter.promptNumber('How much did it cost?');
      cost = answer.number;

      if (this.isCostValid(cost)) {
        break;
      }

      this.clearAndDisplayTitle();
      this.userIO.print('Invalid cost, please enter a positive number with at most two decimal places!');
    }

    return cost;
  }

  private isCostValid(cost: number): boolean {
    const isPositiveNumber = typeof cost === 'number' && !isNaN(cost) && cost > 0;

    if (!isPositiveNumber) {
      return false;
    } else if (!String(cost).includes('.')) {
      return true;
    } else {
      const decimalPlaces = String(cost).split('.')[1].length;
      return decimalPlaces <= 2;
    }
  }
}
