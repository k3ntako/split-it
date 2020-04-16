import IPage from './IPage';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import { Answers } from 'inquirer';
import AddTransactionPage from './AddTransactionPage';
import { IUser } from '../tables/UserTable';
import Separator from 'inquirer/lib/objects/separator';

interface INextPageOptions {
  [key: string]: new (userIO: IUserIO, prompter: IPrompter, user: IUser) => IPage;
  'Add transaction': new (userIO: IUserIO, prompter: IPrompter, user: IUser) => IPage;
}

export default class MenuPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  private nextPageOptions: INextPageOptions;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.nextPageOptions = {
      'Add transaction': AddTransactionPage,
    }
  }

  async display(): Promise<IPage | null> {
    this.userIO.clear();

    const exitChoices: (string | Separator)[] = [
      new Separator(),
      'Exit',
    ];
    let choices: (string | Separator)[] = Object.keys(this.nextPageOptions)
    choices = choices.concat(exitChoices);

    const answer: Answers = await this.prompter.promptList('Main menu:', choices);
    const action: string = answer.action;

    if (action === 'Exit') {
      return null;
    }

    const nextPage: new (userIO: IUserIO, prompter: IPrompter, user: IUser) => IPage = this.nextPageOptions[action];

    return new nextPage(this.userIO, this.prompter, this.user);
  }
}
