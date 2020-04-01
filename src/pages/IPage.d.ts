export default interface IPage {
  display(): IPage | Promise<IPage | null> | null;
}