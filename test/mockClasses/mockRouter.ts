import { IRouter } from "../../src/Router";
import IPage from "../../src/pages/IPage";

export default class MockRouter implements IRouter {
  currentPage: IPage;
  startCallNum: number;
  navigateToCall: number;
  constructor(initialPage: IPage) {
    this.currentPage = initialPage;
    this.startCallNum = 0;
    this.navigateToCall = 0;
  }

  async displayPages(): Promise<void>{
    await this.currentPage.display();
    this.startCallNum++;
  }
}