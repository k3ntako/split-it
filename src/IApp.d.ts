import IMain from "./IMain";

export default interface IApp {
  main: IMain;
  start(): void;
}