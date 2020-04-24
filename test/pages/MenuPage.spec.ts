import { expect } from 'chai';
import MenuPage from '../../src/pages/MenuPage';
import AddTransactionPage from '../../src/pages/AddTransactionPage';
import ViewBalancePage from '../../src/pages/ViewBalancePage';
import ViewTransactionPage from '../../src/pages/ViewTransactionPage';
import MockCLI from '../mockClasses/mockCLI';
import Prompter, { IPrompter, IQuestionOptions } from '../../src/Prompter';
import Separator from 'inquirer/lib/objects/separator';

describe('MenuPage', () => {
  it('should display options for user', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Add transaction' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    await menuPage.execute();

    const arg: IQuestionOptions = mockCLI.promptArguments[0];
    expect(arg.type).to.equal('list');
    expect(arg.name).to.equal('action');
    expect(arg.message).to.equal('Main menu:');
    expect(arg.choices).to.eql(['Add transaction', 'View balance', 'View transactions', new Separator(), 'Exit']);
  });

  it('should return AddTransactionPage if user selects to add transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Add transaction' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    const nextPage = await menuPage.execute();

    expect(nextPage).to.be.an.instanceOf(AddTransactionPage);
  });

  it('should return ViewBalancePage if user selects to add transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'View balance' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    const nextPage = await menuPage.execute();

    expect(nextPage).to.be.an.instanceOf(ViewBalancePage);
  });

  it('should return ViewTransactions if user selects to add transaction', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'View transactions' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    const nextPage = await menuPage.execute();

    expect(nextPage).to.be.an.instanceOf(ViewTransactionPage);
  });

  it('should return null if user exits', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Exit' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new MenuPage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    const nextPage = await menuPage.execute();

    expect(nextPage).to.be.null;
  });
});
