import IPage from '../IPage';
import { IUserIO } from '../../CLI';
import { IPrompter } from '../../Prompter';
import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';
import TransactionFormatter, { ITransactionsWithUsers } from './TransactionFormatter';
import { transactionTable } from '../../tables';
import MenuPage from '../MenuPage';
import Separator from 'inquirer/lib/objects/separator';
import { Answers } from 'inquirer';

export default class ViewBalancePage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  transactionFormatter: TransactionFormatter;
  private page: number;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.transactionFormatter = new TransactionFormatter();
    this.page = 0;
  }

  async execute(): Promise<IPage> {
    this.printTitle();

    const transactionsWithUsers = await this.getTransactionsWithUsers();

    const promptChoices: (string | Separator)[] = await this.createPromptChoices(transactionsWithUsers);

    const answer: Answers = await this.getNextPage(promptChoices);

    return this.routePage(answer);
  }

  private async getTransactionsWithUsers(): Promise<ITransactionsWithUsers[]> {
    return await transactionTable.getTransactionsWithUsers(this.user.id, 11, this.page * 10);
  }

  private printTitle() {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Transactions\n'));
  }

  private async createPromptChoices(transactionsWithUsers: ITransactionsWithUsers[]) {
    const hasMoreThanTen: boolean = transactionsWithUsers.length === 11;
    const firstTenTransactions: ITransactionsWithUsers[] = transactionsWithUsers.splice(0, 10);

    const transactionStrings: string[] = await this.transactionFormatter.format(firstTenTransactions, this.user);
    transactionStrings.forEach((ts) => this.userIO.print(ts));

    const promptChoices: (string | Separator)[] = ['Return to menu'];

    if (hasMoreThanTen || this.page !== 0) {
      promptChoices.push(new Separator());
    }
    if (hasMoreThanTen) {
      promptChoices.push('Next page');
    }
    if (this.page > 0) {
      promptChoices.push('Previous page');
    }

    return promptChoices;
  }

  private async getNextPage(promptChoices: (string | Separator)[]): Promise<Answers> {
    return await this.prompter.promptList('Select One', promptChoices);
  }

  private routePage(answer: Answers) {
    if (answer.action === 'Next page') {
      this.page++;
      return this.execute();
    } else if (answer.action === 'Previous page') {
      this.page--;
      return this.execute();
    } else {
      return new MenuPage(this.userIO, this.prompter, this.user);
    }
  }
}
