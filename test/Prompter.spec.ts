import { expect } from 'chai';
import Prompter from '../src/Prompter';
import MockCLI from './mockClasses/mockCLI';

describe('Prompter', () => {
  describe('promptList', () => {
    it('should ask for a multiple choice input', async () => {
      const mockCLI: MockCLI = new MockCLI();
      const promptPreparer = new Prompter(mockCLI);

      await promptPreparer.promptList('Who is this?', ['New Account']);

      expect(mockCLI.promptArguments[0]).to.eql({
        type: "list",
        name: 'action',
        message: "Who is this?",
        choices: ['New Account'],
      });
    });
  });

  describe('promptInput', () => {
    it('should ask for a text input', async () => {
      const mockCLI: MockCLI = new MockCLI();
      const promptPreparer = new Prompter(mockCLI);

      await promptPreparer.promptInput('What\'s your name?');

      expect(mockCLI.promptArguments[0]).to.eql({
        type: "input",
        name: 'input',
        message: "What's your name?",
      });
    });
  });
});
