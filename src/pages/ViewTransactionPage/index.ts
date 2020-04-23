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

  async display(): Promise<IPage> {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Transactions\n'));

    const transactionsWithUsers: ITransactionsWithUsers[] = await transactionTable.getTransactionsWithUsers(
      this.user.id,
      11,
      this.page * 10,
    );

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

    const answer: Answers = await this.prompter.promptList('Select One', promptChoices);

    if (answer.action === 'Next page') {
      this.page++;
      return this.display();
    } else if (answer.action === 'Previous page') {
      this.page--;
      return this.display();
    } else {
      return new MenuPage(this.userIO, this.prompter, this.user);
    }
  }
}
