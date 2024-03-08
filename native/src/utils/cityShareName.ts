import { CityModel } from 'shared/api'

const cityShareName = (city: CityModel | undefined): string => {
  if (!city) {
    return ''
  }
  return city.prefix ? `${city.prefix} ${city.sortingName}` : city.sortingName
}

export default cityShareName
