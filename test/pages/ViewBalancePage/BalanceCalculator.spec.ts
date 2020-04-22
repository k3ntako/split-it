import { expect } from 'chai';
import BalanceCalculator from '../../../src/pages/ViewBalancePage/BalanceCalculator';
import PG_Interface from '../../../src/PG_Interface';
import { IUser } from '../../../src/tables/UserTable';
import { userTable, transactionTable } from '../../../src/tables';
import { ITransactionUser } from '../../../src/tables/TransactionTable';

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

  it('should return the amount the user owes and is owed', async () => {
    const calc = new BalanceCalculator();

    const transactionUser: ITransactionUser[] = await transactionTable.getTransactionUser(activeUser.id);

    const balance = calc.calculateBalance(transactionUser, activeUser);

    expect(balance).to.exist;
    expect(balance).to.be.an('object');
    expect(balance).to.have.keys([user2.id, user3.id, user4.id]);
    expect(balance[user2.id]).to.equal(51361);
    expect(balance[user3.id]).to.equal(1100);
    expect(balance[user4.id]).to.equal(-6020); // owes money
  });
});
