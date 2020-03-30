import { IUserIO } from './CLI';
import { IPrompter } from './Prompter';
import User from './models/User'
import { IDatabaseIO } from './FileIO';
import { Answers } from 'inquirer';

export interface IMain {
  start(): Promise<void>;
}

export default class Main implements IMain {
  userIO: IUserIO;
  databaseIO: IDatabaseIO;
  prompter: IPrompter;

  constructor(userIO: IUserIO, databaseIO: IDatabaseIO, prompter: IPrompter) {
    this.userIO = userIO;
    this.databaseIO = databaseIO;
    this.prompter = prompter;
  }

  async start(): Promise<void> {
    this.userIO.clear();
    this.userIO.print('Welcome to Split-it!');

    await this.getPerson();
  }

  private async getPerson(): Promise<void>{
    const answer: Answers = await this.prompter.promptList('Who is this?', ['New Account']);

    if (answer.action === 'New Account'){
      this.userIO.clear();
      const nameAnswer: Answers = await this.prompter.promptInput('What\'s your name?');
      const name: string = nameAnswer.input;

      User.create(name, this.databaseIO);
    }
  }
}
