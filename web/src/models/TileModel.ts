export default class TileModel {
  _title: string
  _path: string
  _thumbnail: string
  _postData?: Map<string, string>

  constructor(params: { title: string; path: string; thumbnail: string; postData?: Map<string, string> }) {
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
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

  get postData(): Map<string, string> | undefined {
    return this._postData
  }
}
