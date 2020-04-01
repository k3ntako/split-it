const comparerNames: string[] = ['ILIKE'];

export interface IComparer {
  validate(rowValue: string | number, queryValue: string | number): boolean;
  compare(rowValue: string | number, queryValue: string | number): boolean;
}

export interface IComparers {
  [key: string]: IComparer;
}

const comparers: IComparers = {};

comparerNames.forEach(comparer => {
  comparers[comparer] = require(`./${comparer}`).default;
});

export default comparers;