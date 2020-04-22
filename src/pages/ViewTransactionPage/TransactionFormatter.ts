import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';
import { userTable } from '../../tables';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface ITransactionsWithUsers {
  transaction_name: string;
  cost: number;
  date: Date;
  lender_name: string;
  borrower_name: string;
  amount_owed: number;
}

export default class TransactionFormatter {
  constructor() {}

  async format(transactionsWithUsers: ITransactionsWithUsers[], activeUser: IUser): Promise<string[]> {
    const users: IUser[] = await userTable.getAll();

    const transactionStrings: string[] = transactionsWithUsers.map((tu: any) => {
      const user = this.getUserInvolved(tu, users, activeUser);
      const amountStr = this.formatUserAndAmount(tu, user, activeUser);
      return `${this.formatDateStr(tu.date)} ${tu.transaction_name}\n${amountStr}`;
    });

    return transactionStrings;
  }

  private getUserInvolved(tu: ITransactionsWithUsers, users: IUser[], activeUser: IUser): IUser {
    const user: IUser | undefined = users.find((u: IUser) => {
      return (
        (u.first_name === tu.lender_name || u.first_name === tu.borrower_name) && u.first_name !== activeUser.first_name
      );
    });

    if (!user) {
      return {
        id: -1,
        first_name: '[UNKNOWN]',
      };
    }

    return user;
  }

  private formatDateStr(date: Date): string {
    const monthStr: string = MONTHS[date.getMonth()];
    const dateStr: string = date.getDate() < 10 ? `0${date.getDate()}` : String(date.getDate());
    return `${monthStr} ${dateStr}, ${date.getFullYear()}`;
  }

  private formatUserAndAmount(tu: ITransactionsWithUsers, user: IUser, activeUser: IUser): string {
    const isLender = tu.lender_name === activeUser.first_name;
    const amount: number = tu.amount_owed;
    const formattedAmount = this.formatAmount(isLender, amount);

    return isLender
      ? `${user.first_name} owes you ${formattedAmount}`
      : `You owe ${user.first_name} ${formattedAmount}`;
  }

  formatAmount(isLender: boolean, amount: number): string {
    let amountStr = String(amount / 100);

    const hasTwoDecimalPlaces = amountStr.length - 1 - amountStr.indexOf('.') === 2;

    if (!amountStr.includes('.')) {
      amountStr += '.00';
    } else if (!hasTwoDecimalPlaces) {
      amountStr += '0';
    }

    return isLender ? chalk.green(`$${amountStr}`) : chalk.red(`$${amountStr}`);
  }
}
