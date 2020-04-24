import IPage from './IPage';
import { Answers } from 'inquirer';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import SignUpPage from './SignUpPage';
import { userTable } from '../tables';
import Separator from 'inquirer/lib/objects/separator';
import MenuPage from './MenuPage';
import { IUser } from '../tables/UserTable';

export default class LoginPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async execute(): Promise<IPage> {
    this.printTitle();

    const users: IUser[] = await this.getUsers();
    const choices: (string | Separator)[] = this.createPromptChoices(users);
    const answer: Answers = await this.getNextPage(choices);

    return this.routePage(answer, users);
  }

  private printTitle() {
    this.userIO.clear();
  }

  private async getUsers() {
    return await userTable.getAll();
  }

  private createPromptChoices(users: IUser[]): (string | Separator)[] {
    const names = users.map((user) => user.first_name);
    return ['New Account', new Separator()].concat(names);
  }

  private async getNextPage(promptChoices: (string | Separator)[]): Promise<Answers> {
    return await this.prompter.promptList('Who is this?', promptChoices);
  }

  private getActiveUser(answer: Answers, users: IUser[]): IUser {
    const user: IUser | undefined = users.find((u) => u.first_name === answer.action);

    if (!user) {
      throw new Error(`User, ${answer.action}, was not found`);
    }

    return user;
  }

  private routePage(answer: Answers, users: IUser[]) {
    if (answer.action === 'New Account') {
      return new SignUpPage(this.userIO, this.prompter);
    }

    const user: IUser = this.getActiveUser(answer, users);
    return new MenuPage(this.userIO, this.prompter, user);
  }
}
