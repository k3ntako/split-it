const { expect } = require('chai');
import App from '../src/App'
import IMain from '../src/IMain';

class MockMain implements IMain {
  startCallNum: number;
  constructor(){
    this.startCallNum = 0
  }

  start(){
    this.startCallNum++;
  }
}

describe('welcome message', () => {
  it('should call print with welcome message', () => {
    const mockMain: MockMain = new MockMain;
    const app = new App(mockMain);
    app.start();

    expect(mockMain.startCallNum).to.equal(1);
  });
});