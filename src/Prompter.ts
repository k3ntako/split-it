import { IUserIO } from './CLI';
import { Answers } from 'inquirer';
import Separator from 'inquirer/lib/objects/separator';

export interface IPrompter {
  userIO: IUserIO;
  promptList(message: string, choices: (string | Separator)[]): Promise<Answers>;
  promptInput(message: string): Promise<Answers>;
  promptConfirm(message: string): Promise<Answers>;
  promptNumber(message: string): Promise<Answers>;
  promptDate(message: string): Promise<Answers>;
}

export interface IQuestionOptions {
  type: string;
  name: string;
  message: string;
  choices?: (string | Separator)[];
  format?: string[];
}

export default class Prompter implements IPrompter {
  userIO: IUserIO;
  constructor(userIO: IUserIO) {
    this.userIO = userIO;
  }

  async promptList(message: string, choices: (string | Separator)[]): Promise<Answers> {
    const options: IQuestionOptions[] = [{
      type: 'list',
      name: 'action',
      message,
      choices,
    }];

    return await this.userIO.prompt(options);
  }

  async promptInput(message: string): Promise<Answers> {
    const options: IQuestionOptions[] = [{
      type: 'input',
      name: 'input',
      message,
    }];

    return await this.userIO.prompt(options);
  }

  async promptConfirm(message: string): Promise<Answers> {
    const options: IQuestionOptions[] = [{
      type: 'confirm',
      name: 'confirmation',
      message,
    }];

    return await this.userIO.prompt(options);
  }

  async promptNumber(message: string): Promise<Answers> {
    const options: IQuestionOptions[] = [{
      type: 'number',
      name: 'number',
      message,
    }];

    return await this.userIO.prompt(options);
  }

  async promptDate(message: string): Promise<Answers> {
    const options: IQuestionOptions[] = [{
      type: 'datetime',
      name: 'date',
      message,
      format: ['m', '/', 'd', '/', 'yy'],
    }];

    return await this.userIO.prompt(options);
  }
}