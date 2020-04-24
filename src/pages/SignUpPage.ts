import IPage from './IPage';
import { Answers } from 'inquirer';
import { userTable } from '../tables';
import { IUser } from '../tables/UserTable';
import { IUserIO } from '../CLI';
import { IPrompter } from '../Prompter';
import MenuPage from './MenuPage';

export default class SignUpPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async execute(): Promise<IPage> {
    this.userIO.clear();

    const user: IUser = await this.createUser();

    return this.routePage(user);
  }

  private async createUser(): Promise<IUser> {
    let isValid: boolean = false;
    let user: IUser | null = null;

    while (!isValid) {
      try {
        const nameAnswer: Answers = await this.promptName();
        const firstName: string = nameAnswer.input;

        user = await userTable.create(firstName);

        isValid = true;
      } catch (error) {
        this.userIO.clear();
        this.userIO.print(`${error} - try again!`);
      }
    }

    if (!user) {
      throw new Error('No user created');
    }

    return user;
  }

  private async promptName(): Promise<Answers> {
    return await this.prompter.promptText("What's your name?");
  }

  private routePage(user: IUser): IPage {
    return new MenuPage(this.userIO, this.prompter, user);
  }
}
