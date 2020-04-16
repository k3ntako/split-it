import { expect } from 'chai';
import LoginPage from '../../src/pages/LoginPage';
import SignUpPage from '../../src/pages/SignUpPage';
import MenuPage from '../../src/pages/MenuPage';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../src/Prompter';
import { userTable } from '../../src/tables';
import Separator from 'inquirer/lib/objects/separator';
import Postgres from '../../src/Postgres';

describe('LoginPage', () => {
  const postgres = new Postgres;

  before(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');
  });

  after(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');
    await postgres.end();
  });

  it('should ask user if they would like to create a new account', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'New Account' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new LoginPage(mockCLI, prompter);
    await loginPage.display();

    const arg = mockCLI.promptArguments[0];

    expect(arg.type).to.equal('list');
    expect(arg.name).to.equal('action');
    expect(arg.message).to.equal('Who is this?');

    if (arg.choices) {
      expect(arg.choices[0]).to.equal('New Account');
      expect(arg.choices[1]).to.be.instanceOf(Separator);
    } else {
      expect.fail('Expected choices to exist');
    }

    expect(mockCLI.clearCallNum).to.equal(1);
  });

  it('should return SignUp page if user selects New Account', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'New Account' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new LoginPage(mockCLI, prompter);
    const nextPage = await loginPage.display();

    expect(nextPage).to.be.an.instanceOf(SignUpPage);
  });

  it('should show list of users to login', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'New Account' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    await userTable.create('Bjorn');

    const loginPage = new LoginPage(mockCLI, prompter);
    await loginPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[0];
    expect(arg.choices).to.include.members(['New Account', 'Bjorn']);
  });

  it('should return MenuPage if the user logs in', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Bjorn' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new LoginPage(mockCLI, prompter);
    const nextPage = await loginPage.display();

    expect(nextPage).to.be.an.instanceOf(MenuPage);
  });
});
