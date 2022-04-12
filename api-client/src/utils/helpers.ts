import normalizeStrings from 'normalize-strings'

import CityModel from '../models/CityModel'

export const normalizeSearchString = (str: string): string => normalizeStrings(str).toLowerCase().trim()

export const cityFilter =
  (filterText: string, developerFriendly = false) =>
  (cityModel: CityModel): boolean => {
    const normalizedFilter = normalizeSearchString(filterText)

    // TODO Remove filter once django has replaced wordpress and there is no city with empty path anymore
    if (cityModel.code === '') {
      return false
    }

    if (normalizedFilter === 'wirschaffendas') {
      return !cityModel.live
    }

    const validCity = cityModel.live || developerFriendly
    const matchesName = normalizeSearchString(cityModel.name).includes(normalizedFilter)
    const matchesAlias = Object.keys(cityModel.aliases ?? {}).some(alias =>
      normalizeSearchString(alias).includes(normalizedFilter)
    )

    return validCity && (matchesName || matchesAlias)
  }

export const citySort = (a: CityModel, b: CityModel): number => {
  // There is currently a bug in hermes crashing the app if using localeCompare on empty string
  // Therefore the following does not work if there are two cities with the same sortingName of which one has no prefix set:
  // return a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || '')
  // https://github.com/facebook/hermes/issues/602
  const sortingNameCompare = a.sortingName.localeCompare(b.sortingName)
  if (sortingNameCompare !== 0) {
    return sortingNameCompare
  }
  if (!b.prefix) {
    return 1
  }
  if (!a.prefix) {
    return -1
  }
  // Landkreis should come before Stadt
  return a.prefix.localeCompare(b.prefix)
}
