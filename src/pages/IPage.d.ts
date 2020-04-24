export default interface IPage {
  execute(): IPage | Promise<IPage | null> | null;
}
