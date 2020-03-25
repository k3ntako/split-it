import { Answers, Question } from "inquirer";

export default interface ICLI {
  print(message: string): void;
  clear(): void;
  prompt(questions: Question[]): Promise<Answers>;
}