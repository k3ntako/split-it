import { expect } from 'chai';
import App from '../src/App';
import { IMain } from '../src/Main';

class MockMain implements IMain {
  startCallNum: number;
  constructor() {
    this.startCallNum = 0;
  }

  async start(): Promise<void> {
    this.startCallNum++;
    return Promise.resolve();
  }

  async getPerson(): Promise<void> {
    return Promise.resolve();
  }
}

describe('App', () => {
  describe('start', () => {
    it('should start Main', () => {
      const mockMain: MockMain = new MockMain();
      const app = new App(mockMain);
      app.start();

      expect(mockMain.startCallNum).to.equal(1);
    });
  });
});
