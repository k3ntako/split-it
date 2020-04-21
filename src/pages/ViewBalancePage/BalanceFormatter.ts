import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';

export default class BalanceFormatter {
  constructor() {}

  formatForPrint(balance: Record<string, number>, users: IUser[]): string[] {
    const balanceMessages: string[] = [];
    for (const userId in balance) {
      const user = users.find((u) => u.id === Number(userId));
      const amount = balance[userId];

      if (!user || !amount) {
        continue;
      }

      const balanceStr: string = this.generateBalanceStr(amount, user);
      balanceMessages.push(balanceStr);
    }

    return balanceMessages;
  }

  private generateBalanceStr(amount: number, user: IUser): string {
    const formattedAmount = this.formatAmount(amount);

    const isPostive = amount > 0;

    return isPostive
      ? `${user.first_name} owes you ${formattedAmount}`
      : `You owe ${user.first_name} ${formattedAmount}`;
  }

  private formatAmount(amount: number): string {
    const isPostive = amount > 0;
    amount = Math.abs(amount / 100);

    let amountStr = String(amount);
    const hasTwoDecimalPlaces = amountStr.length - 1 - amountStr.indexOf('.') === 2;

    if (!amountStr.includes('.')) {
      amountStr += '.00';
    } else if (!hasTwoDecimalPlaces) {
      amountStr += '0';
    }

    return isPostive ? chalk.green(`$${amountStr}`) : chalk.red(`$${amountStr}`);
  }
}
