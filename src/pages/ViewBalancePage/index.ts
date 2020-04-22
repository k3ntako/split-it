import IPage from '../IPage';
import { IUserIO } from '../../CLI';
import { IPrompter } from '../../Prompter';
import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';
import { transactionTable, userTable } from '../../tables';
import { ITransactionUser } from '../../tables/TransactionTable';
import BalanceCalculator from './BalanceCalculator';
import BalanceFormatter from './BalanceFormatter';
import MenuPage from '../MenuPage';

export default class ViewBalancePage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  balanceCalculator: BalanceCalculator;
  balanceFormatter: BalanceFormatter;

  constructor(
    userIO: IUserIO,
    prompter: IPrompter,
    user: IUser,
    balanceCalculator: BalanceCalculator,
    balanceFormatter: BalanceFormatter,
  ) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.balanceCalculator = balanceCalculator;
    this.balanceFormatter = balanceFormatter;
  }

  async display() {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Balance\n'));

    const transactionUsers: ITransactionUser[] = await transactionTable.getTransactionUser(this.user.id);
    const balance = this.balanceCalculator.calculateBalance(transactionUsers, this.user);
    const users: IUser[] = await userTable.getAll();

    const balanceMessages = this.balanceFormatter.formatForPrint(balance, users);
    balanceMessages.forEach((str) => this.userIO.print(str));

    this.userIO.print('\n');

    await this.prompter.promptList('Enter to return', ['Return to menu']);

    return new MenuPage(this.userIO, this.prompter, this.user);
  }
}
