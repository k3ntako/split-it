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

  async execute() {
    this.printTitle();

    const transactionUsers: ITransactionUser[] = await this.getTransactionUser(this.user.id);
    const balance = this.balanceCalculator.calculateBalance(transactionUsers, this.user);

    const users: IUser[] = await this.getUsers();

    const balanceMessages: string[] = this.formatBalanceStrings(balance, users);
    this.printBalanceStrings(balanceMessages);

    await this.getNextPage();
    return this.routePage();
  }

  private printTitle() {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Balance\n'));
  }

  private async getUsers(): Promise<IUser[]> {
    return await userTable.getAll();
  }

  private formatBalanceStrings(balance: Record<string, number>, users: IUser[]): string[] {
    return this.balanceFormatter.formatForPrint(balance, users);
  }

  private printBalanceStrings(balanceMessages: string[]): void {
    balanceMessages.forEach((str) => this.userIO.print(str));
    this.userIO.print('\n');
  }

  private async getTransactionUser(id: number): Promise<ITransactionUser[]> {
    return await transactionTable.getTransactionUser(id);
  }

  private async getNextPage(): Promise<void> {
    await this.prompter.promptList('Enter to return', ['Return to menu']);
  }

  private routePage(): IPage {
    return new MenuPage(this.userIO, this.prompter, this.user);
  }
}
