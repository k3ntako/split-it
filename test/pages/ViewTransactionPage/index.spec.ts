import { expect } from 'chai';
import MockCLI from '../../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../../src/Prompter';
import ViewTransactionPage from '../../../src/pages/ViewTransactionPage';
import MenuPage from '../../../src/pages/MenuPage';
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

    // does not involve active user
    await transactionTable.create(user2.id, user3.id, 'Dinner', new Date('11/29/1900'), 51.88);

    // 12 transactions involving active user
    await transactionTable.create(activeUser.id, user3.id, 'Trip to Canada', new Date('12/09/2030'), 10.1);
    await transactionTable.create(user4.id, activeUser.id, 'SodaStream', new Date('3/09/2025'), 20.2);
    await transactionTable.create(user4.id, activeUser.id, 'Adopt Dog', new Date('11/12/2020'), 30.3);
    await transactionTable.create(activeUser.id, user3.id, 'Birthday Gift', new Date('8/7/2020'), 40.4);
    await transactionTable.create(activeUser.id, user2.id, 'Electricity Bill', new Date('3/22/2020'), 50.5);
    await transactionTable.create(user2.id, activeUser.id, 'Microwave', new Date('01/01/2020'), 60.6);
    await transactionTable.create(user2.id, activeUser.id, 'Gas Bill', new Date('01/02/2020'), 70.7);
    await transactionTable.create(activeUser.id, user2.id, 'Internet Bill', new Date('12/31/2019'), 80.8);
    await transactionTable.create(activeUser.id, user3.id, 'Lunch', new Date('12/09/2015'), 90.9);
    await transactionTable.create(user4.id, activeUser.id, 'Potato Chips', new Date('8/24/2012'), 100.1);
    await transactionTable.create(activeUser.id, user2.id, 'French Lessons', new Date('05/27/1973'), 110.1);
    await transactionTable.create(activeUser.id, user2.id, 'Rent', new Date('05/27/1900'), 120.12);
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

    expect(mockCLI.printArguments[1]).to.include(chalk.green('$5.05'));
    expect(mockCLI.printArguments[2]).to.include(chalk.red('$10.10'));
    expect(mockCLI.printArguments[3]).to.include(chalk.red('$15.15'));
    expect(mockCLI.printArguments[4]).to.include(chalk.green('$20.20'));
    expect(mockCLI.printArguments[5]).to.include(chalk.green('$25.25'));
  });

  it('should ask user to return to the menu', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewTransactionPage(mockCLI, prompter, activeUser);
    await viewBalancePage.display();

    expect(mockCLI.promptArguments).to.eql([
      {
        type: 'list',
        name: 'action',
        message: 'Enter to return',
        choices: ['Return to menu'],
      },
    ]);
  });

  it('should return MenuPage', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewTransactionPage(mockCLI, prompter, activeUser);
    const nextPage = await viewBalancePage.display();

    expect(nextPage).to.be.an.instanceOf(MenuPage);
    expect(mockCLI.printArguments[1]).to.include(chalk.red('$60.20'));
    expect(mockCLI.printArguments[2]).to.include(chalk.green('$25.56'));
    expect(mockCLI.printArguments[3]).to.include(chalk.red('$11.95'));
    expect(mockCLI.printArguments[4]).to.include(chalk.green('$11.00'));
    expect(mockCLI.printArguments[5]).to.include(chalk.green('$500.00'));
  });
});
