import IPage from "./IPage";
import { Answers } from "inquirer";
import { IUserIO } from "../CLI";
import FileIO from "../FileIO";
import { IPrompter } from "../Prompter";
import SignUpPage from "./SignUpPage";

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
      return new SignUpPage(this.userIO, new FileIO(), this.prompter);
    }

    return null;
  }
}