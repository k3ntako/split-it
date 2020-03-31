import IPage from "./IPage";
import { Answers } from "inquirer";
import User from "../models/User";
import { IUserIO } from "../CLI";
import { IDatabaseIO } from "../FileIO";
import { IPrompter } from "../Prompter";

export default class LoginPage implements IPage {
  userIO: IUserIO;
  databaseIO: IDatabaseIO;
  prompter: IPrompter;
 
  constructor(userIO: IUserIO, databaseIO: IDatabaseIO, prompter: IPrompter){
    this.userIO = userIO;
    this.databaseIO = databaseIO;
    this.prompter = prompter;
  }

  async display(): Promise<null> {
    this.userIO.clear();

    const answer: Answers = await this.prompter.promptList('Who is this?', ['New Account']);

    if (answer.action === 'New Account') {
      this.userIO.clear();
      const nameAnswer: Answers = await this.prompter.promptInput('What\'s your name?');
      const name: string = nameAnswer.input;

      User.create(name, this.databaseIO);
    }
    
    return null;
  }
}