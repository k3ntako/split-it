import IPage from './IPage';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import { Answers } from 'inquirer';
import AddTransactionPage from './AddTransactionPage';
import { IUser } from '../tables/UserTable';
import Separator from 'inquirer/lib/objects/separator';
import ViewBalancePage from './ViewBalancePage';
import ViewTransactionPage from './ViewTransactionPage';
import BalanceCalculator from './ViewBalancePage/BalanceCalculator';
import BalanceFormatter from './ViewBalancePage/BalanceFormatter';

interface INextPageOptions {
  [key: string]: IPage;
  'Add transaction': IPage;
  'View balance': IPage;
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
      'Add transaction': new AddTransactionPage(this.userIO, this.prompter, this.user),
      'View balance': new ViewBalancePage(
        this.userIO,
        this.prompter,
        this.user,
        new BalanceCalculator(),
        new BalanceFormatter(),
      ),
      'View transactions': new ViewTransactionPage(this.userIO, this.prompter, this.user),
    };
  }

  async execute(): Promise<IPage | null> {
    this.printTitle();

    const choices = this.createPromptChoices();
    const answer = await this.getNextPage(choices);

    return this.routePage(answer);
  }

  private printTitle() {
    this.userIO.clear();
  }

  private createPromptChoices(): (string | Separator)[] {
    const exitChoices: (string | Separator)[] = [new Separator(), 'Exit'];
    let choices: (string | Separator)[] = Object.keys(this.nextPageOptions);
    return choices.concat(exitChoices);
  }

  private async getNextPage(choices: (string | Separator)[]): Promise<Answers> {
    return await this.prompter.promptList('Main menu:', choices);
  }

  private routePage(answer: Answers): IPage | null {
    const action: string = answer.action;

    if (action === 'Exit') {
      return null;
    }

    return this.nextPageOptions[action];
  }
}
