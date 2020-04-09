import { IUserIO } from './CLI';
import { Answers } from 'inquirer';
import Separator from 'inquirer/lib/objects/separator';

export interface IPrompter {
  userIO: IUserIO;
  promptList(message: string, choices: (string | Separator)[]): Promise<Answers>;
  promptInput(message: string): Promise<Answers>;
}

export interface IQuestionOptions {
  type: string;
  name: string;
  message: string;
  choices?: (string | Separator)[];
}

export default class Prompter implements IPrompter{
  userIO: IUserIO;
  constructor(userIO: IUserIO){
    this.userIO = userIO;
  }

  async promptList(message: string, choices: (string | Separator)[]): Promise<Answers>{
    const options: IQuestionOptions[] = [{
      type: 'list',
      name: 'action',
      message,
      choices,
    }];

    return await this.userIO.prompt(options);
  }

  async promptInput(message: string): Promise<Answers>{
    const options: IQuestionOptions[] = [{
      type: 'input',
      name: 'input',
      message,
    }];

    return await this.userIO.prompt(options);
  }
}