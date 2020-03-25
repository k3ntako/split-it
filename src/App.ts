import { IMain } from './Main';

export interface IApp {
  main: IMain;
  start(): void;
}

export default class App implements IApp {
  main: IMain;

  constructor(main: IMain){
    this.main = main;
  }

  start(){
    this.main.start();
  }
}
