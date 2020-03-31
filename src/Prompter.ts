import { IUserIO } from './CLI';
import { Answers, ListQuestionOptions, InputQuestionOptions } from 'inquirer';

export interface IPrompter {
  userIO: IUserIO;
  promptList(message: string, choices: string[]): Promise<Answers>;
  promptInput(message: string): Promise<Answers>;
}

export default class Prompter implements IPrompter{
  userIO: IUserIO;
  constructor(userIO: IUserIO){
    this.userIO = userIO;
  }

  async promptList(message: string, choices: string[]): Promise<Answers>{
    const options: ListQuestionOptions[] = [{
      type: 'list',
      name: 'action',
      message,
      choices,
    }];

    return await this.userIO.prompt(options);
  }

  async promptInput(message: string): Promise<Answers>{
    const options: InputQuestionOptions[] = [{
      type: 'input',
      name: 'input',
      message,
    }];

    return await this.userIO.prompt(options);
  }
}