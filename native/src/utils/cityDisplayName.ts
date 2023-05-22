import { CityModel } from 'api-client/src'

import dimensions from '../constants/dimensions'

export const forceNewlineAfterChar = (text: string, char: string): string => text.replace(char, `${char}\n`)

const cityDisplayName = (city: CityModel | undefined, deviceWidth: number): string => {
  if (!city) {
    return ''
  }
  const cityType = city.prefix ? ` (${city.prefix})` : ''
  const shortCityName = city.sortingName.length < deviceWidth / dimensions.headerTextSize
  return shortCityName ? `${city.sortingName}${cityType}` : `${forceNewlineAfterChar(city.sortingName, '-')}${cityType}`
}

export default cityDisplayName
