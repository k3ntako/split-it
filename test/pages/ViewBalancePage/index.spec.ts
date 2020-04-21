import { expect } from 'chai';
import MockCLI from '../../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../../src/Prompter';

import ViewBalancePage from '../../../src/pages/ViewBalancePage';
import chalk from 'chalk';
import { userTable, transactionTable } from '../../../src/tables';
import PG_Interface from '../../../src/PG_Interface';
import { IUser } from '../../../src/tables/UserTable';
import BalanceCalculator from '../../../src/pages/ViewBalancePage/BalanceCalculator';
import BalanceFormatter from '../../../src/pages/ViewBalancePage/BalanceFormatter';

let pgInterface: PG_Interface, activeUser: IUser, user2: IUser, user3: IUser, user4: IUser;

describe('ViewBalancePage', () => {
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

  it('should display title', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewBalancePage(
      mockCLI,
      prompter,
      activeUser,
      new BalanceCalculator(),
      new BalanceFormatter(),
    );
    await viewBalancePage.display();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockCLI.printArguments[0]).to.equal(chalk.bold('Balance\n'));
  });

  it('should display total amount owed to user', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewBalancePage(
      mockCLI,
      prompter,
      activeUser,
      new BalanceCalculator(),
      new BalanceFormatter(),
    );
    await viewBalancePage.display();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockCLI.printArguments).to.eql([
      chalk.bold('Balance\n'),
      `${user2.first_name} owes you ${chalk.green('$513.61')}`,
      `${user3.first_name} owes you ${chalk.green('$11.00')}`,
      `You owe ${user4.first_name} ${chalk.red('$60.20')}`,
      '\n',
    ]);
  });

  it('should ask user to return to main menu', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const viewBalancePage = new ViewBalancePage(
      mockCLI,
      prompter,
      activeUser,
      new BalanceCalculator(),
      new BalanceFormatter(),
    );
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
});
