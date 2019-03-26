// @flow

export default class TileModel {
  _id: string
  _title: string
  _path: string
  _thumbnail: string
  _isExternalUrl: boolean
  _postData: ?Map<string, string>
  _onTilePress: () => void
  _notifications: number

  constructor (params: {|
    id: string,
    title: string,
    path: string,
    thumbnail: string,
    isExternalUrl: boolean,
    postData?: ?Map<string, string>,
    onTilePress?: () => void,
    notifications?: number
  |}) {
    this._id = params.id
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
    this._isExternalUrl = params.isExternalUrl
    this._postData = params.postData
    this._onTilePress = params.onTilePress
    this._notifications = params.notifications
  }

  get id (): string {
    return this._id
  }

  get thumbnail (): string {
    return this._thumbnail
  }

  get title (): string {
    return this._title
  }

  get path (): string {
    return this._path
  }

  get isExternalUrl (): boolean {
    return this._isExternalUrl
  }

  get postData (): ?Map<string, string> {
    return this._postData
  }

  get onTilePress (): () => void {
    return this._onTilePress
  }

  get notifications (): number {
    return this._notifications
  }
}
