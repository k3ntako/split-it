import { expect } from 'chai';
import BalanceCalculator from '../../../src/pages/ViewBalancePage/BalanceCalculator';
import PG_Interface from '../../../src/PG_Interface';
import { IUser } from '../../../src/tables/UserTable';
import { userTable, transactionTable } from '../../../src/tables';
import { ITransactionUser } from '../../../src/tables/TransactionTable';
import chalk from 'chalk';
import BalanceFormatter from '../../../src/pages/ViewBalancePage/BalanceFormatter';

let pgInterface: PG_Interface, activeUser: IUser, user2: IUser, user3: IUser, user4: IUser;

describe('BalanceCalculator', () => {
  before(async () => {
    pgInterface = new PG_Interface();

    activeUser = await userTable.create('ViewBalancePage 1');
    user2 = await userTable.create('ViewBalancePage 2');
    user3 = await userTable.create('ViewBalancePage 3');
    user4 = await userTable.create('ViewBalancePage 4');

    await transactionTable.create(activeUser.id, user2.id, 'Electricity Bill', new Date(), 51.12);
    await transactionTable.create(user2.id, activeUser.id, 'Gas Bill', new Date(), 23.9);
    await transactionTable.create(activeUser.id, user2.id, 'Rent', new Date(), 1000);
    await transactionTable.create(activeUser.id, user3.id, 'Lunch', new Date(), 22);
    await transactionTable.create(user2.id, user3.id, 'Dinner', new Date(), 51.88);
    await transactionTable.create(user4.id, activeUser.id, 'SodaStream', new Date(), 120.4);
  });

  after(async () => {
    await pgInterface.query('DELETE FROM transaction_users;');
    await pgInterface.query('DELETE FROM transactions;');
    await pgInterface.query('DELETE FROM users;');

    await pgInterface.end();
  });

  it('should return the balance as an array of strings', async () => {
    const calc = new BalanceCalculator();
    const transactionUser: ITransactionUser[] = await transactionTable.getTransactionUser(activeUser.id);
    const balance = calc.calculateBalance(transactionUser, activeUser);
    const users: IUser[] = await userTable.getAll();

    const balanceFormatter = new BalanceFormatter();
    const balanceMessages = balanceFormatter.formatForPrint(balance, users);

    expect(balanceMessages[0]).to.equal(`${user2.first_name} owes you ${chalk.green('$513.61')}`);
    expect(balanceMessages[1]).to.equal(`${user3.first_name} owes you ${chalk.green('$11.00')}`);
    expect(balanceMessages[2]).to.equal(`You owe ${user4.first_name} ${chalk.red('$60.20')}`);
  });
});
