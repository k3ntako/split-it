import ICLI from './ICLI';

export default class Main {
  cli: ICLI;

  constructor(cli: ICLI) {
    this.cli = cli;
  }

  start(){
    this.cli.clear();
    this.cli.print("Welcome to Split-it!");
  }
}