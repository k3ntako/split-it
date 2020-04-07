import IPage from "./IPage";
import { Answers } from "inquirer";
import User from "../models/User";
import { IUserIO } from "../CLI";
import { IPrompter } from "../Prompter";
import { IPostgresIO } from "../PostgresIO";

export default class SignUpPage implements IPage {
  userIO: IUserIO;
  postgresIO: IPostgresIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter, postgresIO: IPostgresIO){
    this.userIO = userIO;
    this.postgresIO = postgresIO;
    this.prompter = prompter;
  }

  async display(): Promise<null> {
    this.userIO.clear();

    let isValid: boolean = false;

    while (!isValid) {
      try {
        const nameAnswer: Answers = await this.prompter.promptInput('What\'s your name?');
        const name: string = nameAnswer.input;

        await User.create(name, this.postgresIO);

        isValid = true;
      } catch (error) {
        this.userIO.clear();
        this.userIO.print(`${error} - try again!`);
      }
    }

    return null;
  }
}