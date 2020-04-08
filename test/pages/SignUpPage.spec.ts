import { expect } from 'chai';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';
import SignUpPage from '../../src/pages/SignUpPage';
import { userTable } from '../../src/tables';

describe('SignUpPage', () => {
  it('should save user to database', async () => {
    // The fake user inputs
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ input: 'K3ntako' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new SignUpPage(mockCLI, prompter);
    await loginPage.display();

    expect(mockCLI.clearCallNum).to.equal(1);

    const user = await userTable.findByName('K3ntako');

    if (user) {
      expect(user.name).to.equal('K3ntako');
    } else {
      expect.fail('Expected user to exist');
    }
  });

  it('should continue to save user until they enter a valid name', async () => {
    // Fake calls that were already made
    // Acting as if an account with name, "K3ntako", was already created
    userTable.create('Kenny');

    // The fake user inputs
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [
      { input: '' },
      { input: 'Kenny' },
      { input: 'New valid name' },
    ];

    const prompter: IPrompter = new Prompter(mockCLI);

    const signUpPage = new SignUpPage(mockCLI, prompter);
    await signUpPage.display();

    const newValidName = await userTable.findByName('New valid name');
    expect(newValidName).to.exist;
  });
});
