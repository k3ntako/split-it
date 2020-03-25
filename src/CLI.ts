import ICLI from './ICLI';
import { Answers, Question } from 'inquirer';
const clear = require('clear');
const inquirer = require('inquirer');

export default class CLI implements ICLI {
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