import IPage from "./IPage";
import { Answers } from "inquirer";
import { userTable } from '../tables';
import { IUser } from "../tables/UserTable";
import { IUserIO } from "../CLI";
import { IPrompter } from "../Prompter";
import MenuPage from "./MenuPage";

export default class SignUpPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async display(): Promise<IPage> {
    this.userIO.clear();

    let isValid: boolean = false;
    let user: IUser | null = null;

    while (!isValid) {
      try {
        const nameAnswer: Answers = await this.prompter.promptText('What\'s your name?');
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

    return new MenuPage(this.userIO, this.prompter, user);
  }
}