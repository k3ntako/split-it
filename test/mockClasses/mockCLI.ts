import { IUserIO } from '../../src/CLI';
import { Answers, Question } from 'inquirer';

export default class MockCLI implements IUserIO {
  printArguments: string[];
  clearCallNum: number;
  promptArguments: Question[];
  promptMockAnswers: Answers[];
  private promptMockAnswersIdx: number;
  constructor() {
    this.printArguments = [];
    this.clearCallNum = 0;
    this.promptArguments = [];
    this.promptMockAnswers = [];
    this.promptMockAnswersIdx = 0;
  }

  print(message: string): void {
    this.printArguments.push(message);
  }

  clear(): void {
    this.clearCallNum++;
  }

  async prompt(questions: Question[]): Promise<Answers>{
    this.promptArguments = this.promptArguments.concat(questions);

    const returnAnswer = this.promptMockAnswers[this.promptMockAnswersIdx];
    this.promptMockAnswersIdx++;

    return Promise.resolve(returnAnswer || {});
  }
}