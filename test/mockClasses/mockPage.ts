import IPage from "../../src/pages/IPage";

export default class MockPage implements IPage {
  displayCallNum: number;
  mockNextPage: IPage | null;

  constructor() {
    this.displayCallNum = 0;
    this.mockNextPage = null;
  }

  display(): IPage | null {
    this.displayCallNum++;

    return this.mockNextPage;
  }
}