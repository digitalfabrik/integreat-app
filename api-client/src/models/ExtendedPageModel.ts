import type Moment from 'moment'
import PageModel from './PageModel'
import { isEqual } from 'lodash'

class ExtendedPageModel extends PageModel {
  _thumbnail: string
  _availableLanguages: Map<string, string>

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string
    lastUpdate: Moment
    availableLanguages: Map<string, string>
    hash: string
  }) {
    const { thumbnail, availableLanguages, ...other } = params
    super(other)
    this._thumbnail = thumbnail
    this._availableLanguages = availableLanguages
  }

  get thumbnail(): string {
    return this._thumbnail
  }

  get availableLanguages(): Map<string, string> {
    return this._availableLanguages
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof ExtendedPageModel &&
      super.isEqual(other) &&
      this.thumbnail === other.thumbnail &&
      isEqual(this.availableLanguages, other.availableLanguages)
    )
  }
}

export default ExtendedPageModel