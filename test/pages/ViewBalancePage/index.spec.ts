import { expect } from 'chai';
import MockCLI from '../../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../../src/Prompter';

import ViewBalancePage from '../../../src/pages/ViewBalancePage';
import chalk from 'chalk';
import { userTable, transactionTable } from '../../../src/tables';
import PG_Interface from '../../../src/PG_Interface';
import { IUser } from '../../../src/tables/UserTable';

let pgInterface: PG_Interface, activeUser: IUser, user2: IUser, user3: IUser, user4: IUser;

describe('ViewBalance', () => {
  before(async () => {
    pgInterface = new PG_Interface();

    activeUser = await userTable.create('ViewBalancePage 1');
    user2 = await userTable.create('ViewBalancePage 2');
    user3 = await userTable.create('ViewBalancePage 3');
    user4 = await userTable.create('ViewBalancePage 4');

    await transactionTable.create(activeUser.id, user2.id, 'Electricity Bill', new Date(), 51.12);
    await transactionTable.create(user2.id, activeUser.id, 'Gas Bill', new Date(), 23.93);
    await transactionTable.create(activeUser.id, user2.id, 'Rent', new Date(), 1000);
    await transactionTable.create(activeUser.id, user3.id, 'Lunch', new Date(), 23.76);
    await transactionTable.create(user2.id, user3.id, 'Dinner', new Date(), 51.89);
    await transactionTable.create(user4.id, activeUser.id, 'SodaStream', new Date(), 120.99);
  });

  after(async () => {
    await pgInterface.query('DELETE FROM transaction_users;');
    await pgInterface.query('DELETE FROM transactions;');
    await pgInterface.query('DELETE FROM users;');

    await pgInterface.end();
  });

  it('should display title', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Add transaction' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new ViewBalancePage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    await menuPage.display();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockCLI.printArguments).to.eql([chalk.bold('Balance\n')]);
  });
});
