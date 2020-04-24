import IPage from '../IPage';
import MenuPage from '../MenuPage';
import { IPrompter } from '../../Prompter';
import { IUserIO } from '../../CLI';
import { userTable, transactionTable } from '../../tables';
import { IUser } from '../../tables/UserTable';
import TransactionUserInput from './TransactionUserInput';

export default class AddTransactionPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  transactionUserInput: TransactionUserInput;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.transactionUserInput = new TransactionUserInput(userIO, prompter);
  }

  async execute(): Promise<IPage> {
    const users: IUser[] = await this.getUsers();
    const otherUser: IUser = await this.getOtherUser(users);

    const { lenderId, borrowerId, name, date, cost } = await this.promptTransactionParams(otherUser);
    await this.createTransaction(lenderId, borrowerId, name, date, cost);

    return this.routePage();
  }

  private async getUsers(): Promise<IUser[]> {
    return await userTable.getAll();
  }

  private async getOtherUser(users: IUser[]): Promise<IUser> {
    const otherUser = await this.transactionUserInput.getUser(users, this.user);

    if (!otherUser) {
      throw Error('The other user cannot be undefined.');
    }

    return otherUser;
  }

  private async promptTransactionParams(otherUser: IUser) {
    const name: string = await this.transactionUserInput.getName();
    const date: Date = await this.transactionUserInput.getDate();
    const userPaid: boolean = await this.transactionUserInput.getUserPaid();
    const cost: number = await this.transactionUserInput.getCost();

    const [lender, borrower]: IUser[] = userPaid ? [this.user, otherUser] : [otherUser, this.user];

    return {
      lenderId: lender.id,
      borrowerId: borrower.id,
      name,
      date,
      cost,
    };
  }

  private async createTransaction(lenderId: number, borrowerId: number, name: string, date: Date, cost: number) {
    await transactionTable.create(lenderId, borrowerId, name, date, cost);
  }

  private routePage(): IPage {
    return new MenuPage(this.userIO, this.prompter, this.user);
  }
}
