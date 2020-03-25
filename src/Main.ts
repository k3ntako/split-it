import ICLI from './ICLI';
import IPrompter from './IPrompter';

export default class Main {
  cli: ICLI;
  prompter: IPrompter;

  constructor(cli: ICLI, prompter: IPrompter) {
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
