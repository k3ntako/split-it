import ICLI from './ICLI';
const clear = require('clear');

export default class CLI implements ICLI {
  constructor(){}

  print(message: string){
    console.log(message);
  }

  clear(){
    clear();
  }
}