import { IO } from './CLI';
import { IPrompter } from './Prompter';

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
    const answer = await this.prompter.promptList('Who is this?', ['New Account']);

    if (answer.action === 'New Account'){
      this.cli.clear();
      await this.prompter.promptInput('What\'s your name?');
    }
  }
}
