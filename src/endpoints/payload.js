export default class {
  constructor (isFetching, data = null, error = null) {
    this.isFetching = isFetching
    this.data = data
    this.error = error
  }
}
