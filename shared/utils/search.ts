import normalizeStrings from 'normalize-strings'

import CityModel from '../api/models/CityModel'

export const normalizeString = (str: string): string => normalizeStrings(str).toLowerCase().trim()

const cityFilter =
  (filterText: string, developerFriendly: boolean) =>
  (cityModel: CityModel): boolean => {
    const normalizedFilter = normalizeString(filterText)

    if (normalizedFilter === 'wirschaffendas') {
      return !cityModel.live
    }

    const validCity = cityModel.live || developerFriendly
    const aliases = Object.keys(cityModel.aliases ?? {})
    const matchesFilter = [cityModel.name, ...aliases].some(it => normalizeString(it).includes(normalizedFilter))
    return validCity && matchesFilter
  }

const citySort = (a: CityModel, b: CityModel): number =>
  // There is currently a bug in hermes crashing the app if using localeCompare on empty string
  // Therefore the following does not work if there are two cities with the same sortingName of which one has no prefix set:
  // return a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || '')
  // https://github.com/facebook/hermes/issues/602
  a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || '')

export const filterSortCities = (cities: CityModel[], filterText: string, developerFriendly = false): CityModel[] =>
  cities.filter(cityFilter(filterText, developerFriendly)).sort(citySort)
