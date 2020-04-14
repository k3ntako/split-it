import { expect } from 'chai';
import AddTransactionPage from '../../src/pages/AddTransactionPage';
import MockCLI from '../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../src/Prompter';
import Postgres from '../../src/Postgres';
import { userTable } from '../../src/tables';

describe('AddTransactionPage', () => {
  const postgres = new Postgres;

  before(async () => {
    await postgres.query('DELETE FROM transaction_people;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    await userTable.create('Kentaro');
    await userTable.create('Olga');
    await userTable.create('Chris');
  });

  after(async () => {
    await postgres.query('DELETE FROM transaction_people;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    await postgres.end();
  });


  it('should ask user who else was involved in the transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    const prompter: IPrompter = new Prompter(mockCLI);

    const addTransactionPage = new AddTransactionPage(mockCLI, prompter, { id: 1, first_name: 'Kentaro' });
    await addTransactionPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[0];
    expect(arg.type).to.equal('list');
    expect(arg.message).to.equal('Who was this transaction with?');

    expect(mockCLI.clearCallNum).to.equal(6);

    expect(arg.choices).to.have.all.members(['Olga', 'Chris']);
  });

  it('should ask to name the transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Olga' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const addTransactionPage = new AddTransactionPage(mockCLI, prompter, { id: 1, first_name: 'Kentaro' });
    await addTransactionPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[1];
    expect(arg.type).to.equal('input');
    expect(arg.message).to.equal('What would you like to name this transaction?');
  });

  it('should ask the date of the transaction?', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: 'Expensive lunch' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const addTransactionPage = new AddTransactionPage(mockCLI, prompter, { id: 1, first_name: 'Kentaro' });
    await addTransactionPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[2];
    expect(arg.type).to.equal('datetime');
    expect(arg.message).to.equal('When was the transaction?');
  });

  it('should ask user if they paid for the transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: 'Expensive lunch' }, { date: new Date() }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const addTransactionPage = new AddTransactionPage(mockCLI, prompter, { id: 1, first_name: 'Kentaro' });
    await addTransactionPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[3];
    expect(arg.message).to.equal('Did you pay for this?');
    expect(arg.type).to.equal('confirm');
  });

  it('should ask user how much the transaction cost', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: 'Expensive lunch' }, { date: new Date() }, { confirmation: true }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const addTransactionPage = new AddTransactionPage(mockCLI, prompter, { id: 1, first_name: 'Kentaro' });
    await addTransactionPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[4];
    expect(arg.message).to.equal('How much did it cost?');
    expect(arg.type).to.equal('number');
  });
});
