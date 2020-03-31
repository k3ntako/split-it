import IPage from "./pages/IPage";

export interface IRouter {
  currentPage: IPage;
  start(): void;
  navigateTo(page: IPage): void;
}

export default class Router implements IRouter {
  currentPage: IPage;

  constructor(intialPage: IPage){
    this.currentPage = intialPage;
  }

  start(){
    this.currentPage.display();
  }

  navigateTo(page: IPage){
    this.currentPage = page;
    this.currentPage.display();
  }
}