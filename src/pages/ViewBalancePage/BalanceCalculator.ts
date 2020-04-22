import { ITransactionUser } from '../../tables/TransactionTable';
import { IUser } from '../../tables/UserTable';

export default class BalanceCalculator {
  constructor() {}

  calculateBalance(transactionUsers: ITransactionUser[], user: IUser) {
    const balance: Record<string, number> = {};
    transactionUsers.forEach((tu) => {
      const isLender = tu.lender_id === user.id;
      const otherUserId: number = isLender ? tu.borrower_id : tu.lender_id;
      const amountOwedToUser: number = isLender ? tu.amount_owed : -1 * tu.amount_owed;

      if (otherUserId in balance) {
        balance[otherUserId] += amountOwedToUser;
      } else {
        balance[otherUserId] = amountOwedToUser;
      }
    });

    return balance;
  }
}
