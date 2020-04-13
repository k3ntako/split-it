import IPage from './IPage';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import { Answers } from 'inquirer';

export default class MenuPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.prompter = prompter;
  }


  async display(): Promise<IPage | null> {
    this.userIO.clear();

    const choices = ['New transaction'];

    const answer: Answers = await this.prompter.promptList('Main menu:', choices);
    console.log(answer);

    return null;
  }
}
