export default class OfferModel {
  _alias: string
  _title: string
  _path: string
  _thumbnail: string

  constructor(params: { alias: string; title: string; path: string; thumbnail: string }) {
    this._alias = params.alias
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
  }

  get alias(): string {
    return this._alias
  }

  get thumbnail(): string {
    return this._thumbnail
  }

  get title(): string {
    return this._title
  }

  get path(): string {
    return this._path
  }

  isEqual(other: OfferModel): boolean {
    return (
      this.alias === other.alias &&
      this.thumbnail === other.thumbnail &&
      this.title === other.title &&
      this.path === other.path
    )
  }
}
