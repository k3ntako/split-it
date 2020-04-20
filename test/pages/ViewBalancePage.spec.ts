import { expect } from 'chai';
import MockCLI from '../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';

import ViewBalancePage from '../../src/pages/ViewBalancePage';
import chalk from 'chalk';

describe('ViewBalance', () => {
  it('should display title', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'Add transaction' }];
    const prompter: IPrompter = new Prompter(mockCLI);

    const menuPage = new ViewBalancePage(mockCLI, prompter, {
      id: 1,
      first_name: 'Bob',
    });
    await menuPage.display();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockCLI.printArguments).to.eql([chalk.bold('Balance\n')]);
  });
});
