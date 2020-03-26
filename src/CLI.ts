import { Answers, Question } from 'inquirer';
const clear = require('clear');
const inquirer = require('inquirer');

export interface IO {
  print(message: string): void;
  clear(): void;
  prompt(questions: Question[]): Promise<Answers>;
}

export default class CLI implements IO {
  constructor(){}

  print(message: string){
    console.log(message);
  }

  clear(){
    clear();
  }

  async prompt(questions: Question[]): Promise<Answers>{
    return await inquirer.prompt(questions);
  }
}