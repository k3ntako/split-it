const comparerNames: string[] = ['ILIKE'];

export interface IComparer {
  validate(rowValue: any, queryValue: any): boolean;
  compare(rowValue: any, queryValue: any): boolean;
}

export interface IComparers {
  [key: string]: IComparer;
}

const comparers: IComparers = {};

comparerNames.forEach(comparer => {
  comparers[comparer] = require(`./${comparer}`).default;
});

export default comparers;