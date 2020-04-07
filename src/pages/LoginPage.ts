import IPage from "./IPage";
import { Answers } from "inquirer";
import { IUserIO } from "../CLI";
import { IPrompter } from "../Prompter";
import SignUpPage from "./SignUpPage";
import PostgresIO from "../PostgresIO";

export default class LoginPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter){
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async display(): Promise<IPage | null> {
    this.userIO.clear();

    const answer: Answers = await this.prompter.promptList('Who is this?', ['New Account']);

    if (answer.action === 'New Account') {
      return new SignUpPage(this.userIO, this.prompter, new PostgresIO());
    }

    return null;
  }
}