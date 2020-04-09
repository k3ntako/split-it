import { IQuestionOptions } from "./Prompter";
import { Answers } from "inquirer";

const clear = require('clear');
const inquirer = require('inquirer');

export interface IUserIO {
  print(message: string): void;
  clear(): void;
  prompt(questions: IQuestionOptions[]): Promise<Answers>;
}

export default class CLI implements IUserIO {
  constructor(){}

  print(message: string){
    console.log(message);
  }

  clear(){
    clear();
  }

  async prompt(questions: IQuestionOptions[]): Promise<Answers>{
    return await inquirer.prompt(questions);
  }
}