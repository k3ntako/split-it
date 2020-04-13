import IPage from './IPage';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import { Answers } from 'inquirer';
import AddTransactionPage from './AddTransactionPage';

interface INextPageOptions {
  [key: string]: new () => IPage;
  'Add transaction': new () => IPage;
}

const nextPageOptions: INextPageOptions = {
  'Add transaction': AddTransactionPage,
}

export default class MenuPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async display(): Promise<IPage> {
    this.userIO.clear();

    const choices: string[] = Object.keys(nextPageOptions);

    const answer: Answers = await this.prompter.promptList('Main menu:', choices);
    const action: string = answer.action;

    return new nextPageOptions[action];
  }
}
