import { expect } from 'chai';
import Main from '../src/Main';
import MockCLI from './mockClasses/mockCLI';
import Prompter, { IPrompter } from '../src/Prompter';
import MockFileIO from './mockClasses/mockFileIO';
import { IRowWithoutId } from '../src/FileIO';

describe('Main', () => {
  describe('start', () => {
    it('should call print with welcome message', async () => {
      const mockCLI: MockCLI = new MockCLI();
      const mockFileIO: MockFileIO = new MockFileIO();
      const prompter: IPrompter = new Prompter(mockCLI);
      const main = new Main(mockCLI, mockFileIO, prompter);
      await main.start();

      expect(mockCLI.clearCallNum).to.be.at.least(1);
      expect(mockCLI.printArguments[0]).to.equal('Welcome to Split-it!');
    });

    it('should ask user if they would like to create a new account', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ action: 'New Account' }];

      const mockFileIO: MockFileIO = new MockFileIO();
      const prompter: IPrompter = new Prompter(mockCLI);

      const main = new Main(mockCLI, mockFileIO, prompter);
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

      const mockFileIO: MockFileIO = new MockFileIO();
      const prompter: IPrompter = new Prompter(mockCLI);

      const main = new Main(mockCLI, mockFileIO, prompter);
      await main.start();

      const [tableName, data]: [string, IRowWithoutId] = mockFileIO.writeRowArguments[0];
      expect(tableName).to.eql('users');
      expect(data.name).to.eql('K3ntako');
    });
  });
});
