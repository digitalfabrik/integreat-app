// @flow

import type Moment from 'moment'
import PageModel from './PageModel'

class ExtendedPageModel extends PageModel {
  _thumbnail: string
  _availableLanguages: Map<string, string>

  constructor (params: {|
    path: string, title: string, content: string, thumbnail: string, lastUpdate: Moment,
    availableLanguages: Map<string, string>, hash: string
  |}) {
    const { thumbnail, availableLanguages, ...other } = params
    super(other)
    this._thumbnail = thumbnail
    this._availableLanguages = availableLanguages
  }

  get thumbnail (): string {
    return this._thumbnail
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default ExtendedPageModel
