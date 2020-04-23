import IPage from '../IPage';
import { IUserIO } from '../../CLI';
import { IPrompter } from '../../Prompter';
import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';
import TransactionFormatter, { ITransactionsWithUsers } from './TransactionFormatter';
import { transactionTable } from '../../tables';
import MenuPage from '../MenuPage';

export default class ViewBalancePage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  transactionFormatter: TransactionFormatter;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.transactionFormatter = new TransactionFormatter();
  }

  async display(): Promise<IPage | null> {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Transactions\n'));

    const transactionsWithUsers: ITransactionsWithUsers[] = await transactionTable.getTransactionsWithUsers(
      this.user.id,
      10,
      null,
    );
    const transactionStrings: string[] = await this.transactionFormatter.format(transactionsWithUsers, this.user);
    transactionStrings.forEach((ts) => this.userIO.print(ts));

    await this.prompter.promptList('Enter to return', ['Return to menu']);

    return new MenuPage(this.userIO, this.prompter, this.user);
  }
}
