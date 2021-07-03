export default class TileModel {
  _title: string
  _path: string
  _thumbnail: string
  _isExternalUrl: boolean
  _postData: Map<string, string> | null

  constructor(params: {
    title: string
    path: string
    thumbnail: string
    isExternalUrl: boolean
    postData: Map<string, string> | null
  }) {
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
    this._isExternalUrl = params.isExternalUrl
    this._postData = params.postData
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

  get isExternalUrl(): boolean {
    return this._isExternalUrl
  }

  get postData(): Map<string, string> | null {
    return this._postData
  }
}
