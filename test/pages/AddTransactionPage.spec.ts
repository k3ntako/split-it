import { expect } from 'chai';
import AddTransactionPage from '../../src/pages/AddTransactionPage';
import MockCLI from '../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../src/Prompter';
import Postgres from '../../src/Postgres';
import { userTable } from '../../src/tables';
import { QueryResult } from 'pg';
import { IUser } from '../../src/tables/UserTable';

describe('AddTransactionPage', () => {
  const postgres = new Postgres;
  let user: IUser;

  before(async () => {
    await postgres.query('DELETE FROM transaction_people;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    user = await userTable.create('Kentaro');
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
    mockCLI.promptMockAnswers = [{ action: 'Olga' }, { input: 'Expensive lunch' }, { date: new Date() }, { confirmation: true }, { number: 100 }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const addTransactionPage = new AddTransactionPage(mockCLI, prompter, user);
    await addTransactionPage.display();

    const otherUserArg: IQuestionOptions = mockCLI.promptArguments[0];
    expect(otherUserArg.type).to.equal('list');
    expect(otherUserArg.message).to.equal('Who was this transaction with?');

    expect(mockCLI.clearCallNum).to.equal(6);

    expect(otherUserArg.choices).to.have.all.members(['Olga', 'Chris']);

    const nameArg: IQuestionOptions = mockCLI.promptArguments[1];
    expect(nameArg.type).to.equal('input');
    expect(nameArg.message).to.equal('What would you like to name this transaction?');

    const dateArg: IQuestionOptions = mockCLI.promptArguments[2];
    expect(dateArg.type).to.equal('datetime');
    expect(dateArg.message).to.equal('When was the transaction?');

    const confirmationArg: IQuestionOptions = mockCLI.promptArguments[3];
    expect(confirmationArg.message).to.equal('Did you pay for this?');
    expect(confirmationArg.type).to.equal('confirm');

    const costArg: IQuestionOptions = mockCLI.promptArguments[4];
    expect(costArg.message).to.equal('How much did it cost?');
    expect(costArg.type).to.equal('number');
  });

  it('should save the transaction', async () => {
    const queryResult: QueryResult = await postgres.query('SELECT * FROM transactions;');
    const transaction = queryResult.rows[0];

    expect(transaction).to.exist;
  });
});
