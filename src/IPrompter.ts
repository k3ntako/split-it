import ICLI from "./ICLI";
import { Answers } from "inquirer";

export default interface IPrompter {
  cli: ICLI;
  promptList(message: string, choices: string[]): Promise<Answers>;
  promptInput(message: string): Promise<Answers>;
}