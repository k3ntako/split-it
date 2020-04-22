import { expect } from 'chai';
import AddTransactionPage from '../../../src/pages/AddTransactionPage';
import MenuPage from '../../../src/pages/MenuPage';
import MockCLI from '../../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../../src/Prompter';
import PG_Interface from '../../../src/PG_Interface';
import { userTable, transactionTable } from '../../../src/tables';
import { IUser } from '../../../src/tables/UserTable';
import { ITransaction } from '../../../src/tables/TransactionTable';
import chalk from 'chalk';

describe('AddTransactionPage', () => {
  const pgInterface = new PG_Interface();
  let activeUser: IUser, otherUser: IUser, addTransactionPage: AddTransactionPage, mockCLI: MockCLI;

  before(async () => {
    await pgInterface.query('DELETE FROM transaction_users;');
    await pgInterface.query('DELETE FROM transactions;');
    await pgInterface.query('DELETE FROM users;');

    activeUser = await userTable.create('Kentaro');
    otherUser = await userTable.create('Olga');
    await userTable.create('Chris');
  });

  after(async () => {
    await pgInterface.query('DELETE FROM transaction_users;');
    await pgInterface.query('DELETE FROM transactions;');
    await pgInterface.query('DELETE FROM users;');

    await pgInterface.end();
  });

  beforeEach(async () => {
    mockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [
      { action: 'Olga' },
      { input: 'Expensive lunch' },
      { date: new Date() },
      { confirmation: true },
      { number: 100 },
    ];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);
  });

  it('should clear screen prior to each question', async () => {
    await addTransactionPage.display();

    expect(mockCLI.clearCallNum).to.equal(mockCLI.promptMockAnswers.length);
  });

  it('should display page title at top prior to each question', async () => {
    await addTransactionPage.display();

    const expectedTitle: string = chalk.bold('Add a Transaction\n');

    const diplayTitleArgs = mockCLI.printArguments.filter((str) => str === expectedTitle);
    expect(diplayTitleArgs).to.have.lengthOf(mockCLI.promptMockAnswers.length);
  });

  it('should ask user who else was involved in the transaction', async () => {
    await addTransactionPage.display();

    const otherUserArg: IQuestionOptions = mockCLI.promptArguments[0];
    expect(otherUserArg.type).to.equal('list');
    expect(otherUserArg.message).to.equal('Who was this transaction with?');
    expect(otherUserArg.choices).to.have.all.members(['Olga', 'Chris']);
  });

  it('should ask user for the transaction name', async () => {
    await addTransactionPage.display();

    const nameArg: IQuestionOptions = mockCLI.promptArguments[1];
    expect(nameArg.type).to.equal('input');
    expect(nameArg.message).to.equal('Name the transaction:');
  });

  it('should ask user for the transaction date', async () => {
    await addTransactionPage.display();

    const dateArg: IQuestionOptions = mockCLI.promptArguments[2];
    expect(dateArg.type).to.equal('datetime');
    expect(dateArg.message).to.equal('When was the transaction?');
  });

  it('should ask user if they paid the transaction', async () => {
    await addTransactionPage.display();

    const confirmationArg: IQuestionOptions = mockCLI.promptArguments[3];
    expect(confirmationArg.message).to.equal('Did you pay for this?');
    expect(confirmationArg.type).to.equal('confirm');
  });

  it('should ask user for the cost', async () => {
    await addTransactionPage.display();

    const costArg: IQuestionOptions = mockCLI.promptArguments[4];
    expect(costArg.message).to.equal('How much did it cost?');
    expect(costArg.type).to.equal('number');
  });

  it('should pass in the active user as lender if they paid', async () => {
    const originalCreate = transactionTable.create; // save original method

    try {
      // mock method
      transactionTable.create = async (
        lenderId: number,
        borrowerId: number,
        name: string,
        date: Date,
        cost: number,
      ): Promise<ITransaction> => {
        expect(lenderId).to.equal(activeUser.id);
        expect(borrowerId).to.equal(otherUser.id);

        return { id: 0, name, cost, date };
      };

      await addTransactionPage.display();
    } catch (error) {
      throw error;
    } finally {
      transactionTable.create = originalCreate; // restore original method
    }
  });

  it('should pass in the active user as borrower if they did not paid', async () => {
    const originalCreate = transactionTable.create; // save original method

    mockCLI.promptMockAnswers = [
      { action: 'Olga' },
      { input: 'Expensive lunch' },
      { date: new Date() },
      { confirmation: false },
      { number: 100 },
    ];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);

    try {
      // mock method
      transactionTable.create = async (
        lenderId: number,
        borrowerId: number,
        name: string,
        date: Date,
        cost: number,
      ): Promise<ITransaction> => {
        expect(lenderId).to.equal(otherUser.id);
        expect(borrowerId).to.equal(activeUser.id);

        return { id: 0, name, cost, date };
      };

      await addTransactionPage.display();
    } catch (error) {
      throw error;
    } finally {
      transactionTable.create = originalCreate; // restore original method
    }
  });

  it('should continue to ask for a name until the input is not blank', async () => {
    const originalCreate = transactionTable.create; // save original method

    mockCLI.promptMockAnswers = [
      { action: 'Olga' },
      { input: '' },
      { input: ' ' },
      { input: 'Expensive lunch' },
      { date: new Date() },
      { confirmation: false },
      { number: 100 },
    ];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);

    try {
      // mock method
      transactionTable.create = async (
        _lenderId: number,
        _borrowerId: number,
        name: string,
        date: Date,
        cost: number,
      ): Promise<ITransaction> => {
        expect(name).to.equal('Expensive lunch');
        return { id: 0, name, cost, date };
      };

      await addTransactionPage.display();

      const expectedError = 'Invalid name, please try again!';
      const diplayErrorArgs = mockCLI.printArguments.filter((str) => str === expectedError);
      expect(diplayErrorArgs).to.have.lengthOf(2);
    } catch (error) {
      throw error;
    } finally {
      transactionTable.create = originalCreate; // restore original method
    }
  });

  it('should continue to ask until cost is a positive number with no more than two decimal places', async () => {
    const originalCreate = transactionTable.create; // save original method

    mockCLI.promptMockAnswers = [
      { action: 'Olga' },
      { input: 'Expensive lunch' },
      { date: new Date() },
      { confirmation: false },
      { number: -1 },
      { number: 0 },
      { number: 10.102 },
      { number: 100.15 },
    ];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);

    try {
      // mock method
      transactionTable.create = async (
        _lenderId: number,
        _borrowerId: number,
        name: string,
        date: Date,
        cost: number,
      ): Promise<ITransaction> => {
        expect(cost).to.equal(100.15);
        return { id: 0, name, cost, date };
      };

      await addTransactionPage.display();

      const expectedError = 'Invalid cost, please enter a positive number with at most two decimal places!';
      const diplayErrorArgs = mockCLI.printArguments.filter((str) => str === expectedError);
      expect(diplayErrorArgs).to.have.lengthOf(3);
    } catch (error) {
      throw error;
    } finally {
      transactionTable.create = originalCreate; // restore original method
    }
  });

  it('should return the MenuPage as the next page', async () => {
    const nextPage = await addTransactionPage.display();
    expect(nextPage).to.be.an.instanceOf(MenuPage);
  });
});
