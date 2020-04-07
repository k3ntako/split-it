import { expect } from 'chai';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';
import SignUpPage from '../../src/pages/SignUpPage';
import MockPostgres from '../mockClasses/mockPostgres';
import UserTable from '../../src/models/UserTable';
import { init } from '../../src/models';

describe('SignUpPage', () => {
  it('should save user to database', async () => {
    // The fake user inputs
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ input: 'K3ntako' }];

    const prompter: IPrompter = new Prompter(mockCLI);
    const mockPostgres = new MockPostgres;
    init(mockPostgres)

    const loginPage = new SignUpPage(mockCLI, prompter);
    await loginPage.display();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockPostgres.createUserArguments[0]).to.eql('K3ntako');
  });

  it('should continue to save user until they enter a valid name', async () => {
    // Fake calls that were already made
    // Acting as if an account with name, "K3ntako", was already created
    const mockPostgres = new MockPostgres();
    init(mockPostgres)

    const userTable = new UserTable(mockPostgres);
    userTable.create('K3ntako');

    // The fake user inputs
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [
      { input: '' },
      { input: 'K3ntako' },
      { input: 'New valid name' },
    ];

    const prompter: IPrompter = new Prompter(mockCLI);

    const signUpPage = new SignUpPage(mockCLI, prompter);
    await signUpPage.display();

    expect(mockPostgres.createUserArguments[1]).to.equal('New valid name');
  });
});
