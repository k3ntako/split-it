import IPage from "./pages/IPage";

export interface IRouter {
  currentPage: IPage | null;
  displayPages(): Promise<void>;
}

export default class Router implements IRouter {
  currentPage: IPage | null;

  constructor(intialPage: IPage){
    this.currentPage = intialPage;
  }

  async displayPages(){
    while (this.currentPage) {
      this.currentPage = await this.currentPage.display();
    }
  }
}