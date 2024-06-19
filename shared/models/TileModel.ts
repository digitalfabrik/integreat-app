export default class TileModel<T = string | null> {
  _title: string
  _path: string
  _thumbnail: T
  _isExternalUrl: boolean
  _onTilePress?: () => void

  constructor(params: {
    title: string
    path: string
    thumbnail: T
    isExternalUrl: boolean
    postData?: Map<string, string>
    onTilePress?: () => void
  }) {
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
    this._isExternalUrl = params.isExternalUrl
    this._onTilePress = params.onTilePress
  }

  get thumbnail(): T {
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

  get onTilePress(): (() => void) | undefined {
    return this._onTilePress
  }
}
