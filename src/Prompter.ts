import { IUserIO } from './CLI';
import { Answers } from 'inquirer';
import Separator from 'inquirer/lib/objects/separator';

export interface IPrompter {
  userIO: IUserIO;
  promptList(message: string, choices: (string | Separator)[]): Promise<Answers>;
  promptText(message: string): Promise<Answers>;
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

  private async prompt(type: string, name: string, message: string, choices?: (string | Separator)[], format?: string[]) {
    const options: IQuestionOptions = { type, name, message };
    choices && choices.length && (options.choices = choices);
    format && (options.format = format);

    return await this.userIO.prompt([options]);
  }

  async promptList(message: string, choices: (string | Separator)[]): Promise<Answers> {
    return await this.prompt('list', 'action', message, choices);
  }

  async promptText(message: string): Promise<Answers> {
    return await this.prompt('input', 'input', message);
  }

  async promptConfirm(message: string): Promise<Answers> {
    return await this.prompt('confirm', 'confirmation', message);
  }

  async promptNumber(message: string): Promise<Answers> {
    return await this.prompt('number', 'number', message);
  }

  async promptDate(message: string): Promise<Answers> {
    return await this.prompt('datetime', 'date', message, [], ['m', '/', 'd', '/', 'yy']);
  }
}