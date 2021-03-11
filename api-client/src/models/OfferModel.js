// @flow

export default class OfferModel {
  _alias: string
  _title: string
  _path: string
  _thumbnail: string
  _postData: ?Map<string, string>

  constructor(params: {|
    alias: string,
    title: string,
    path: string,
    thumbnail: string,
    postData: ?Map<string, string>
  |}) {
    this._alias = params.alias
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
    this._postData = params.postData
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

  get postData(): ?Map<string, string> {
    return this._postData
  }
}
