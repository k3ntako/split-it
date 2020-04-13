import IPage from './IPage';

export default class AddTransactionPage implements IPage {

  constructor() { }


  async display(): Promise<IPage | null> {
    return null;
  }
}
