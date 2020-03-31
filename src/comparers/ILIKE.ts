export default {
  compare(rowValue: string, queryValue: string): boolean {
    return rowValue.toLowerCase() === queryValue.toLowerCase();
  }
}