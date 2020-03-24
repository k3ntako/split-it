import { expect } from 'chai';
import Main from '../src/Main';
import ICLI from '../src/ICLI';

class MockCLI implements ICLI {
  printArguments: string[];
  clearCallNum: number;
  constructor() {
    this.printArguments = [];
    this.clearCallNum = 0;
  }

  print(message: string): void {
    this.printArguments.push(message);
  }

  clear(): void {
    this.clearCallNum++;
  }
}

describe('welcome message', () => {
  it('should call print with welcome message', () => {
    const mockCLI: MockCLI = new MockCLI();
    const main = new Main(mockCLI);
    main.start();

    expect(mockCLI.clearCallNum).to.equal(1);
    expect(mockCLI.printArguments[0]).to.equal('Welcome to Split-it!');
  });
});
