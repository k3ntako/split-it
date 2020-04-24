import { expect } from 'chai';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';
import SignUpPage from '../../src/pages/SignUpPage';
import MenuPage from '../../src/pages/MenuPage';
import { userTable } from '../../src/tables';

describe('SignUpPage', () => {
  it('should save user to database', async () => {
    // The fake user inputs
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ input: 'K3ntako' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new SignUpPage(mockCLI, prompter);
    await loginPage.execute();

    expect(mockCLI.clearCallNum).to.equal(1);

    const user = await userTable.findByName('K3ntako');

    if (user) {
      expect(user.first_name).to.equal('K3ntako');
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
    mockCLI.promptMockAnswers = [{ input: '' }, { input: 'Kenny' }, { input: 'New valid name' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const signUpPage = new SignUpPage(mockCLI, prompter);
    await signUpPage.execute();

    const newValidName = await userTable.findByName('New Valid Name');
    expect(newValidName).to.exist;
  });

  it('should return MenuPage if the user logs in', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ input: 'Rachel' }];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new SignUpPage(mockCLI, prompter);
    const nextPage = await loginPage.execute();

    expect(nextPage).to.be.an.instanceOf(MenuPage);
  });
});
