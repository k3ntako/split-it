import { expect } from 'chai';
import LoginPage from '../../src/pages/LoginPage';
import SignUpPage from '../../src/pages/SignUpPage';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';

describe('LoginPage', () => {
  it('should ask user if they would like to create a new account', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'New Account' }, { input: 'K' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new LoginPage(mockCLI, prompter);
    const nextPage = await loginPage.display();

    expect(mockCLI.promptArguments[0]).to.eql({
      type: "list",
      name: 'action',
      message: "Who is this?",
      choices: ['New Account'],
    });

    expect(mockCLI.clearCallNum).to.equal(1);

    expect(nextPage).to.be.an.instanceOf(SignUpPage);
  });
});
