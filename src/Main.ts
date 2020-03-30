import { IO } from './CLI';
import { IPrompter } from './Prompter';
import User from './models/User'
import FileIO from './FileIO';
import { Answers } from 'inquirer';

export interface IMain {
  start(): Promise<void>;
}

export default class Main implements IMain {
  cli: IO;
  prompter: IPrompter;

  constructor(cli: IO, prompter: IPrompter) {
    this.cli = cli;
    this.prompter = prompter;
  }

  async start(): Promise<void> {
    this.cli.clear();
    this.cli.print('Welcome to Split-it!');

    await this.getPerson();
  }

  private async getPerson(): Promise<void>{
    const answer: Answers = await this.prompter.promptList('Who is this?', ['New Account']);

    if (answer.action === 'New Account'){
      this.cli.clear();
      const nameAnswer: Answers = await this.prompter.promptInput('What\'s your name?');
      const name: string = nameAnswer.input;

      User.create(name, new FileIO);
    }
  }
}
