import { expect } from 'chai';
import AddTransactionPage from '../../src/pages/AddTransactionPage';
import MockCLI from '../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../src/Prompter';
import Postgres from '../../src/Postgres';
import { userTable, transactionTable } from '../../src/tables';
import { IUser } from '../../src/tables/UserTable';
import { ITransaction } from '../../src/tables/TransactionTable';

describe('AddTransactionPage', () => {
  const postgres = new Postgres;
  let activeUser: IUser, otherUser: IUser, addTransactionPage: AddTransactionPage, mockCLI: MockCLI;

  before(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    activeUser = await userTable.create('Kentaro');
    otherUser = await userTable.create('Olga');
    await userTable.create('Chris');
  });

  after(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    await postgres.end();
  });

  beforeEach(async () => {
    mockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: 'Expensive lunch' }, { date: new Date() }, { confirmation: true }, { number: 100 }];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);
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
    expect(nameArg.message).to.equal('What would you like to name this transaction?');
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
      transactionTable.create = async (lenderId: number, borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction> => {
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

    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: 'Expensive lunch' }, { date: new Date() }, { confirmation: false }, { number: 100 }];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);

    try {
      // mock method
      transactionTable.create = async (lenderId: number, borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction> => {
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

    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: '' }, { input: ' ' }, { input: 'Expensive lunch' }, { date: new Date() }, { confirmation: false }, { number: 100 }];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);

    try {
      // mock method
      transactionTable.create = async (_lenderId: number, _borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction> => {
        expect(name).to.equal('Expensive lunch');
        return { id: 0, name, cost, date };
      };

      await addTransactionPage.display();

    } catch (error) {
      throw error;
    } finally {
      transactionTable.create = originalCreate; // restore original method
    }
  });

  it('should continue cost is a positive number with no more than two decimal points', async () => {
    const originalCreate = transactionTable.create; // save original method

    mockCLI.promptMockAnswers = [
      { action: 'Olga' },
      { input: 'Expensive lunch' },
      { date: new Date() },
      { confirmation: false },
      { number: -1 },
      { number: 0 },
      { number: 10.102 },
      { number: 100.15 }
    ];
    const prompter: IPrompter = new Prompter(mockCLI);

    addTransactionPage = new AddTransactionPage(mockCLI, prompter, activeUser);

    try {
      // mock method
      transactionTable.create = async (_lenderId: number, _borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction> => {
        expect(cost).to.equal(100.15);
        return { id: 0, name, cost, date };
      };

      await addTransactionPage.display();
    } catch (error) {
      throw error;
    } finally {
      transactionTable.create = originalCreate; // restore original method
    }
  });
});
