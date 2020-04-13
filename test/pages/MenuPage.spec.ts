import { expect } from 'chai';
import MenuPage from '../../src/pages/MenuPage';
import AddTransactionPage from '../../src/pages/AddTransactionPage';
import MockCLI from '../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../src/Prompter';

describe('MenuPage', () => {
  it('should ask user if they would like to create a new account', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Add transaction' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter);
    await menuPage.display();

    const arg: IQuestionOptions = mockCLI.promptArguments[0];
    expect(arg.type).to.equal('list');
    expect(arg.name).to.equal('action');
    expect(arg.message).to.equal('Main menu:');
    expect(arg.choices).to.have.all.members(['Add transaction']);
  });

  it('should return AddTransactionPage if user selects to add transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Add transaction' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter);
    const nextPage = await menuPage.display();

    expect(nextPage).to.be.an.instanceOf(AddTransactionPage);
  });
});
