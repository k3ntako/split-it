import { expect } from 'chai';
import MockCLI from '../../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../../src/Prompter';
import ViewTransactionPage from '../../../src/pages/ViewTransactionPage';
import chalk from 'chalk';
import PG_Interface from '../../../src/PG_Interface';
import { IUser } from '../../../src/tables/UserTable';
import { userTable, transactionTable } from '../../../src/tables';

describe('ViewBalancePage', () => {
  let pgInterface: PG_Interface, activeUser: IUser, user2: IUser, user3: IUser, user4: IUser;

  before(async () => {
    pgInterface = new PG_Interface();

    activeUser = await userTable.create('ViewBalancePage 1');
    user2 = await userTable.create('ViewBalancePage 2');
    user3 = await userTable.create('ViewBalancePage 3');
    user4 = await userTable.create('ViewBalancePage 4');

    await transactionTable.create(activeUser.id, user2.id, 'Electricity Bill', new Date(), 51.12);
    await transactionTable.create(user2.id, activeUser.id, 'Gas Bill', new Date('01/01/2020'), 23.9);
    await transactionTable.create(activeUser.id, user2.id, 'Rent', new Date('05/27/1900'), 1000);
    await transactionTable.create(activeUser.id, user3.id, 'Lunch', new Date('12/09/2015'), 22);
    await transactionTable.create(user2.id, user3.id, 'Dinner', new Date('11/29/1900'), 51.88);
    await transactionTable.create(user4.id, activeUser.id, 'SodaStream', new Date('3/09/2025'), 120.4);
  });

  after(async () => {
    await pgInterface.query('DELETE FROM transaction_users;');
    await pgInterface.query('DELETE FROM transactions;');
    await pgInterface.query('DELETE FROM users;');

    await pgInterface.end();
  });

  it('should display title', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewTransactionPage(mockCLI, prompter, activeUser);
    await viewBalancePage.display();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockCLI.printArguments[0]).to.equal(chalk.bold('Transactions\n'));
  });

  it('should display the date of each transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewTransactionPage(mockCLI, prompter, activeUser);
    await viewBalancePage.display();

    expect(mockCLI.printArguments[1]).to.include(chalk.red('$60.20'));
    expect(mockCLI.printArguments[2]).to.include(chalk.green('$25.56'));
    expect(mockCLI.printArguments[3]).to.include(chalk.red('$11.95'));
    expect(mockCLI.printArguments[4]).to.include(chalk.green('$11.00'));
    expect(mockCLI.printArguments[5]).to.include(chalk.green('$500.00'));
  });
});