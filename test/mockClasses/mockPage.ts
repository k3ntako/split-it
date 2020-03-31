import IPage from "../../src/pages/IPage";

export default class MockPage implements IPage {
  startCallNum: number;
  constructor() {
    this.startCallNum = 0;
  }

  display(): null {
    this.startCallNum++;
    return null;
  }
}