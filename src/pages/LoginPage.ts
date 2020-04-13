import IPage from "./IPage";
import { Answers } from "inquirer";
import { IUserIO } from "../CLI";
import { IPrompter } from "../Prompter";
import SignUpPage from "./SignUpPage";
import { userTable } from "../tables";
import Separator from "inquirer/lib/objects/separator";

export default class LoginPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, prompter: IPrompter){
    this.userIO = userIO;
    this.prompter = prompter;
  }

  async display(): Promise<IPage | null> {
    this.userIO.clear();

    const users = await userTable.getAll();
    const names = users.map(user => user.first_name);
    const choices = ['New Account', new Separator].concat(names);

    const answer: Answers = await this.prompter.promptList('Who is this?', choices);

    if (answer.action === 'New Account') {
      return new SignUpPage(this.userIO, this.prompter);
    }

    return null;
  }
}