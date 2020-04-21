import IPage from '../IPage';
import { IUserIO } from '../../CLI';
import { IPrompter } from '../../Prompter';
import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';
import { transactionTable, userTable } from '../../tables';
import { ITransactionUser } from '../../tables/TransactionTable';
import BalanceCalculator from './BalanceCalculator';

export default class ViewBalancePage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  balanceCalculator: BalanceCalculator;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser, balanceCalculator: BalanceCalculator) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.balanceCalculator = balanceCalculator;
  }

  async display() {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Balance\n'));

    const transactionUsers: ITransactionUser[] = await transactionTable.getTransactionUser(this.user.id);
    const balance = this.balanceCalculator.calculateBalance(transactionUsers, this.user);
    const users: IUser[] = await userTable.getAll();

    for (const userId in balance) {
      const user = users.find((u) => u.id === Number(userId));
      const amount = balance[userId];

      if (!user || !amount) {
        continue;
      }

      if (amount > 0) {
        const amountStr = chalk.green(`$${amount / 100}`);
        this.userIO.print(`${user.first_name} owes you ${amountStr}`);
      } else {
        const amountStr = chalk.red(`$${amount / -100}`);
        this.userIO.print(`You owe ${user.first_name} ${amountStr}`);
      }
    }

    return null;
  }
}
