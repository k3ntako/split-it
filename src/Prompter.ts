import IPrompter from './IPrompter';
import ICLI from './ICLI';
import { Answers, ListQuestionOptions, InputQuestionOptions } from 'inquirer';

export default class Prompter implements IPrompter{
  cli: ICLI;
  constructor(cli: ICLI){
    this.cli = cli;
  }

  async promptList(message: string, choices: string[]): Promise<Answers>{
    const options: ListQuestionOptions[] = [{
      type: 'list',
      name: 'action',
      message,
      choices,
    }];

    return await this.cli.prompt(options);
  }

  async promptInput(message: string): Promise<Answers>{
    const options: InputQuestionOptions[] = [{
      type: 'input',
      name: 'input',
      message,
    }];

    return await this.cli.prompt(options);
  }
}