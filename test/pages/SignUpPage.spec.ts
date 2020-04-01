import { expect } from 'chai';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';
import MockFileIO from './../mockClasses/mockFileIO';
import { IRow } from '../../src/FileIO';
import SignUpPage from '../../src/pages/SignUpPage';

describe('SignUpPage', () => {
  it('should save user to database', async () => {
    // The fake user inputs 
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ input: 'K3ntako' }]; 

    const mockFileIO: MockFileIO = new MockFileIO();
    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new SignUpPage(mockCLI, mockFileIO, prompter);
    await loginPage.display();

    expect(mockCLI.clearCallNum).to.equal(1);

    const [tableName, data]: [string, IRow] = mockFileIO.writeRowArguments[0];
    expect(tableName).to.eql('users');
    expect(data.name).to.eql('K3ntako');
  });

  it('should continue to save user until they enter a valid name', async () => {
    // Fake calls that were already made
    // Acting as if an account with name, "K3ntako", was already created
    const mockFileIO: MockFileIO = new MockFileIO();
    mockFileIO.writeRowArguments.push([
      'users',
      { id: 'c694fdb4-74e5-4b72-a7d7-15e29f721c5e', name: 'K3ntako' }
    ]);
    
    // The fake user inputs 
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [
      { input: '' }, 
      { input: 'K3ntako' },
      { input: 'New valid name' }
    ];

    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new SignUpPage(mockCLI, mockFileIO, prompter);
    await loginPage.display();

    expect(mockFileIO.writeRowArguments[1][1].name).to.equal('New valid name');
  });
});
