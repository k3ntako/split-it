import { ICLI } from './CLI';
import { Answers, ListQuestionOptions, InputQuestionOptions } from 'inquirer';

export interface IPrompter {
  cli: ICLI;
  promptList(message: string, choices: string[]): Promise<Answers>;
  promptInput(message: string): Promise<Answers>;
}

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