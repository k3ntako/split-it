import { IRouter } from './Router';

export interface IApp {
  router: IRouter;
  start(): void;
}

export default class App implements IApp {
  router: IRouter;

  constructor(router: IRouter){
    this.router = router;
  }

  start(){
    this.router.start();
  }
}
