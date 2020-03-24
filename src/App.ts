import IMain from './IMain';
import IApp from './IApp';


export default class App implements IApp {
  main: IMain;

  constructor(main: IMain){
    this.main = main;
  }

  start(){
    this.main.start();
  }
}