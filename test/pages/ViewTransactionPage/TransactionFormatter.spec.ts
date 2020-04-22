import { expect } from 'chai';
import { transactionTable, userTable } from '../../../src/tables';
import PG_Interface from '../../../src/PG_Interface';
import { IUser } from '../../../src/tables/UserTable';
import TransactionFormatter, {
  TransactionsWithUsers,
} from '../../../src/pages/ViewTransactionPage/TransactionFormatter';
// import chalk from 'chalk';
import { QueryResult } from 'pg';
import chalk from 'chalk';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

describe('TransactionFormatter', () => {
  let pgInterface: PG_Interface, activeUser: IUser, user2: IUser, user3: IUser, user4: IUser;

  before(async () => {
    pgInterface = new PG_Interface();

    activeUser = await userTable.create('ViewBalancePage 1');
    user2 = await userTable.create('ViewBalancePage 2');
    user3 = await userTable.create('ViewBalancePage 3');
    user4 = await userTable.create('ViewBalancePage 4');

    await transactionTable.create(activeUser.id, user2.id, 'Electricity Bill', new Date(), 51.12);
    await transactionTable.create(user2.id, activeUser.id, 'Gas Bill', new Date('01/01/2020'), 23.9);
    await transactionTable.create(activeUser.id, user2.id, 'Rent', new Date('05/27/1900'), 1000);
    await transactionTable.create(activeUser.id, user3.id, 'Lunch', new Date('12/09/2015'), 22);
    await transactionTable.create(user2.id, user3.id, 'Dinner', new Date('11/29/1900'), 51.88);
    await transactionTable.create(user4.id, activeUser.id, 'SodaStream', new Date('3/09/2025'), 120.4);
  });

  after(async () => {
    await pgInterface.query('DELETE FROM transaction_users;');
    await pgInterface.query('DELETE FROM transactions;');
    await pgInterface.query('DELETE FROM users;');

    await pgInterface.end();
  });

  it('should format a transaction into a string and order by date (descending)', async () => {
    const transactionFormatter = new TransactionFormatter();

    const results: QueryResult = await pgInterface.query(`
      SELECT name AS transaction_name, cost, date, lender_name, borrower_name, amount_owed FROM transactions
      JOIN (
        SELECT users.first_name AS lender_name, tu_borrowers.* FROM users
        JOIN (
          SELECT users.first_name AS borrower_name, transaction_users.*  FROM users
          JOIN transaction_users
          ON transaction_users.borrower_id = users.id
        ) as tu_borrowers
        ON tu_borrowers.lender_id = users.id
      ) AS tu_both
      ON transactions.id = tu_both.transaction_id
      AND (tu_both.lender_id=${activeUser.id} OR tu_both.borrower_id=${activeUser.id})
      ORDER BY date DESC;
    `);

    const transactionsWithUsers: TransactionsWithUsers[] = results.rows;
    const transactionStrings = await transactionFormatter.format(transactionsWithUsers, activeUser);
    expect(transactionStrings).to.be.an('array');
    expect(transactionStrings).to.have.lengthOf(5);

    expect(transactionStrings[0]).to.be.a('string');

    const dates = transactionsWithUsers.map((row: TransactionsWithUsers) => {
      const fullDate: Date = row.date;
      const dateStr: string = fullDate.getDate() < 10 ? `0${fullDate.getDate()}` : String(fullDate.getDate());
      return `${MONTHS[fullDate.getMonth()]} ${dateStr}, ${fullDate.getFullYear()}`;
    });

    const names = transactionsWithUsers.map((row) => row.transaction_name);

    expect(transactionStrings[0]).to.equal(
      `${dates[0]} ${names[0]}\nYou owe ${user4.first_name} ${chalk.red('$60.20')}`,
    );
    expect(transactionStrings[1]).to.equal(
      `${dates[1]} ${names[1]}\n${user2.first_name} owes you ${chalk.green('$25.56')}`,
    );
    expect(transactionStrings[2]).to.equal(
      `${dates[2]} ${names[2]}\nYou owe ${user2.first_name} ${chalk.red('$11.95')}`,
    );
    expect(transactionStrings[3]).to.equal(
      `${dates[3]} ${names[3]}\n${user3.first_name} owes you ${chalk.green('$11.00')}`,
    );
    expect(transactionStrings[4]).to.equal(
      `${dates[4]} ${names[4]}\n${user2.first_name} owes you ${chalk.green('$500.00')}`,
    );
  });
});
