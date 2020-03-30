import { expect } from 'chai';
import Main from '../src/Main';
import MockCLI from './mockClasses/mockCLI';
import Prompter, { IPrompter } from '../src/Prompter';
import fs from 'fs';
import del from 'del';

after(async () => {
  await del([process.cwd() + '/test/data']);
});

describe('Main', () => {
  describe('start', () => {
    it('should call print with welcome message', async () => {
      const mockCLI: MockCLI = new MockCLI();
      const prompter: IPrompter = new Prompter(mockCLI);
      const main = new Main(mockCLI, prompter);
      await main.start();

      expect(mockCLI.clearCallNum).to.be.at.least(1);
      expect(mockCLI.printArguments[0]).to.equal('Welcome to Split-it!');
    });

    it('should ask user if they would like to create a new account', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ action: 'New Account' }];

      const prompter: IPrompter = new Prompter(mockCLI);
      const main = new Main(mockCLI, prompter);
      await main.start();

      expect(mockCLI.promptArguments[0]).to.eql({
        type: "list",
        name: 'action',
        message: "Who is this?",
        choices: ['New Account'],
      });

      expect(mockCLI.clearCallNum).to.equal(2);

      expect(mockCLI.promptArguments[1]).to.eql({
        type: "input",
        name: 'input',
        message: "What's your name?",
      });
    });

    it('should save user to database', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ action: 'New Account' }, { input: 'K3ntako' }];

      const prompter: IPrompter = new Prompter(mockCLI);
      const main = new Main(mockCLI, prompter);
      await main.start();

      const databaseFileDir = process.cwd() + '/test/data/users.json';
      const tableStr: string = fs.readFileSync(databaseFileDir, 'utf-8');
      const tableData = JSON.parse(tableStr);

      const key = Object.keys(tableData)[1];
      
      expect(tableData[key].name).to.equal('K3ntako');
    });
  });
});
