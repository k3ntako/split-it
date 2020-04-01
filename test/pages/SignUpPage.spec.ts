import { expect } from 'chai';
import MockCLI from './../mockClasses/mockCLI';
import Prompter, { IPrompter } from '../../src/Prompter';
import MockFileIO from './../mockClasses/mockFileIO';
import { IObjectWithAny } from '../../src/FileIO';
import SignUpPage from '../../src/pages/SignUpPage';

describe('SignUpPage', () => {
  it('should save user to database', async () => {
    const mockCLI: MockCLI = new MockCLI();
    mockCLI.promptMockAnswers = [{ action: 'New Account' }, { input: 'K3ntako' }];

    const mockFileIO: MockFileIO = new MockFileIO();
    const prompter: IPrompter = new Prompter(mockCLI);

    const loginPage = new SignUpPage(mockCLI, mockFileIO, prompter);
    await loginPage.display();

    const [tableName, data]: [string, IObjectWithAny] = mockFileIO.writeRowArguments[0];
    expect(tableName).to.eql('users');
    expect(data.name).to.eql('K3ntako');
  });
});
