// @flow

import buildConfig from '../app/constants/buildConfig'
import Url from 'url-parse'

type CityContentRouteUrlType = {| cityCode: string, languageCode: string, route?: string, path?: ?string |}

const constructUrl = (parts: Array<?string>) => {
  const url = new Url(`https://${buildConfig().hostName}`)
  const pathname = parts.filter(Boolean).map(part => part.toLowerCase()).join('/')
  url.set('pathname', pathname)
  return url
}

export const cityContentUrl = ({ cityCode, languageCode, route, path }: CityContentRouteUrlType): string => {
  const url = constructUrl([cityCode, languageCode, route, path])
  return url.href
}

export const cityContentPath = ({ cityCode, languageCode, route, path }: CityContentRouteUrlType): string => {
  const url = constructUrl([cityCode, languageCode, route, path])
  return url.pathname
}

export const url = (pathname?: string): string => {
  const url = constructUrl([pathname])
  return url.href
}

export const path = (pathname?: string): string => {
  const url = constructUrl([pathname])
  return url.pathname
}
