// @flow

import type Moment from 'moment'
import PageModel from './PageModel'

class ExtendedPageModel extends PageModel {
  _path: string
  _thumbnail: string
  _availableLanguages: Map<string, string>

  constructor (params: {|id: number,
    path: string, title: string, content: string, thumbnail: string, lastUpdate: Moment,
    availableLanguages: Map<string, string>, hash: string|}) {
    const {path, thumbnail, availableLanguages, ...other} = params
    super(other)
    this._path = path
    this._thumbnail = thumbnail
    this._availableLanguages = availableLanguages
  }

  get path (): string {
    return this._path
  }

  get thumbnail (): string {
    return this._thumbnail
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default ExtendedPageModel
