import { DateTime } from 'luxon'

import { getSlugFromPath } from '../../utils'
import isMapEqual from '../../utils/isMapEqual'
import PageModel from './PageModel'

class ExtendedPageModel extends PageModel {
  _thumbnail: string | null
  _availableLanguages: Map<string, string>

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string | null
    lastUpdate: DateTime
    availableLanguages: Map<string, string>
  }) {
    const { thumbnail, availableLanguages, ...other } = params
    super(other)
    this._thumbnail = thumbnail
    this._availableLanguages = availableLanguages
  }

  get thumbnail(): string | null {
    return this._thumbnail
  }

  get availableLanguages(): Map<string, string> {
    return this._availableLanguages
  }

  get availableLanguageSlugs(): { [languageCode: string]: string } {
    return Array.from(this._availableLanguages.entries()).reduce(
      (acc, [code, path]) => ({ ...acc, [code]: getSlugFromPath(path) }),
      {},
    )
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof ExtendedPageModel &&
      super.isEqual(other) &&
      this.thumbnail === other.thumbnail &&
      isMapEqual(this.availableLanguages, other.availableLanguages)
    )
  }
}

export default ExtendedPageModel
