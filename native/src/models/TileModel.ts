import { SvgProps } from 'react-native-svg'

export default class TileModel {
  _title: string
  _path: string
  _thumbnail: React.JSXElementConstructor<SVGElement> | string
  _isExternalUrl: boolean
  _postData?: Map<string, string>
  _onTilePress?: () => void
  _notifications?: number

  constructor(params: {
    title: string
    path: string
    thumbnail: React.JSXElementConstructor<SvgProps> | string
    isExternalUrl: boolean
    postData?: Map<string, string>
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

  get thumbnail(): React.JSXElementConstructor<SvgProps> | string {
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

  get onTilePress(): (() => void) | undefined {
    return this._onTilePress
  }

  get notifications(): number | null | undefined {
    return this._notifications
  }
}
