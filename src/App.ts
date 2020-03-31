import { IRouter } from './Router';

export interface IApp {
  router: IRouter;
  start(): Promise<void>;
}

export default class App implements IApp {
  router: IRouter;

  constructor(router: IRouter){
    this.router = router;
  }

  async start(){
    await this.router.displayPages();
  }
}
