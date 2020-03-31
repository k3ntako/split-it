const comparers = ['ILIKE'];

export default comparers.map(comparer => require(`./${comparer}`).default);
