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
  a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || '')

export const filterSortCities = (cities: CityModel[], filterText: string, developerFriendly = false): CityModel[] =>
  cities.filter(cityFilter(filterText, developerFriendly)).sort(citySort)
