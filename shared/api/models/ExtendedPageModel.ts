import { DateTime } from 'luxon'

import { getSlugFromPath } from '../../utils'
import isEqual from '../../utils/isEqual'
import PageModel from './PageModel'

class ExtendedPageModel extends PageModel {
  _thumbnail: string | null
  _availableLanguages: Record<string, string>

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string | null
    lastUpdate: DateTime
    availableLanguages: Record<string, string>
  }) {
    const { thumbnail, availableLanguages, ...other } = params
    super(other)
    this._thumbnail = thumbnail
    this._availableLanguages = availableLanguages
  }

  get thumbnail(): string | null {
    return this._thumbnail
  }

  get availableLanguages(): Record<string, string> {
    return this._availableLanguages
  }

  get availableLanguageSlugs(): Record<string, string> {
    return Object.entries(this.availableLanguages).reduce(
      (availableLanguageSlugs, [code, path]) => ({ ...availableLanguageSlugs, [code]: getSlugFromPath(path) }),
      {},
    )
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
