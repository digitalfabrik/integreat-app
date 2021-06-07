export default class TileModel {
  _title: string
  _path: string
  _thumbnail: string | number
  _isExternalUrl: boolean
  _postData: Map<string, string> | null | undefined
  _onTilePress: (() => void) | null | undefined
  _notifications: number | null | undefined

  constructor(params: {
    title: string
    path: string
    thumbnail: string | number
    isExternalUrl: boolean
    postData?: Map<string, string> | null | undefined
    onTilePress?: () => void
    notifications?: number
  }) {
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
    this._isExternalUrl = params.isExternalUrl
    this._postData = params.postData
    this._onTilePress = params.onTilePress
    this._notifications = params.notifications
  }

  get thumbnail(): string | number {
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

  get postData(): Map<string, string> | null | undefined {
    return this._postData
  }

  get onTilePress(): (() => void) | null | undefined {
    return this._onTilePress
  }

  get notifications(): number | null | undefined {
    return this._notifications
  }
}
