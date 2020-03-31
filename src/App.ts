import IPage from './pages/IPage';

export interface IApp {
  main: IPage;
  start(): void;
}

export default class App implements IApp {
  main: IPage;

  constructor(main: IPage){
    this.main = main;
  }

  start(){
    this.main.start();
  }
}
