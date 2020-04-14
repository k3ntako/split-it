import IPage from './IPage';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import { Answers } from 'inquirer';
import AddTransactionPage from './AddTransactionPage';
import { IUser } from '../tables/UserTable';

interface INextPageOptions {
  [key: string]: new (userIO: IUserIO, prompter: IPrompter, user: IUser) => IPage;
  'Add transaction': new (userIO: IUserIO, prompter: IPrompter, user: IUser) => IPage;
}

const nextPageOptions: INextPageOptions = {
  'Add transaction': AddTransactionPage,
}

export default class MenuPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
  }

  async display(): Promise<IPage> {
    this.userIO.clear();

    const choices: string[] = Object.keys(nextPageOptions);

    const answer: Answers = await this.prompter.promptList('Main menu:', choices);
    const action: string = answer.action;

    return new nextPageOptions[action](this.userIO, this.prompter, this.user);
  }
}
