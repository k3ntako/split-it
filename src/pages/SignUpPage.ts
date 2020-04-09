import IPage from "./IPage";
import { Answers } from "inquirer";
import { userTable } from '../tables';
import { IUserIO } from "../CLI";
import { IPrompter } from "../Prompter";

export default class SignUpPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter){
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async display(): Promise<null> {
    this.userIO.clear();

    let isValid: boolean = false;

    while (!isValid) {
      try {
        const nameAnswer: Answers = await this.prompter.promptInput('What\'s your name?');
        const firstName: string = nameAnswer.input;

        await userTable.create(firstName);

        isValid = true;
      } catch (error) {
        this.userIO.clear();
        this.userIO.print(`${error} - try again!`);
      }
    }

    return null;
  }
}