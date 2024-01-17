import { JSXElementConstructor } from 'react'
import { SvgProps } from 'react-native-svg'

export default class TileModel {
  _title: string
  _path: string
  _thumbnail: JSXElementConstructor<SVGElement> | string
  _onTilePress?: () => void

  constructor(params: {
    title: string
    path: string
    thumbnail: JSXElementConstructor<SvgProps> | string
    onTilePress?: () => void
  }) {
    this._title = params.title
    this._path = params.path
    this._thumbnail = params.thumbnail
    this._onTilePress = params.onTilePress
  }

  get thumbnail(): JSXElementConstructor<SvgProps> | string {
    return this._thumbnail
  }

  get title(): string {
    return this._title
  }

  get path(): string {
    return this._path
  }

  get onTilePress(): (() => void) | undefined {
    return this._onTilePress
  }
}
