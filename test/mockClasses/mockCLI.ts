import { IUserIO } from '../../src/CLI';
import { Answers } from 'inquirer';
import { IQuestionOptions } from '../../src/Prompter';

export default class MockCLI implements IUserIO {
  printArguments: string[];
  clearCallNum: number;
  promptArguments: IQuestionOptions[];
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

  async prompt(questions: IQuestionOptions[]): Promise<Answers>{
    this.promptArguments = this.promptArguments.concat(questions);

    const returnAnswer = this.promptMockAnswers[this.promptMockAnswersIdx];
    this.promptMockAnswersIdx++;

    return Promise.resolve(returnAnswer || {});
  }
}