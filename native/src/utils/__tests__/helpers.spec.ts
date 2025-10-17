import { times } from 'lodash'
import { Platform } from 'react-native'

import buildConfig from '../../constants/buildConfig'
import appSettings from '../AppSettings'
import { generateRouteKey, getExtension, determineApiUrl, getLocalFilePath, getCachedResource } from '../helpers'

describe('generateRouteKey', () => {
  it('should not generate the same key multiple times', () => {
    const keys = new Array<string>()
    times(1000, () => keys.push(generateRouteKey()))
    expect(new Set(keys).size).toBe(1000)
  })
})

describe('getExtension', () => {
  it('should return the extension of a regular file-url', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png')).toBe('png')
  })
  it('should ignore any trailing query string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png?size=med')).toBe('png')
  })
  it('should ignore any trailing hash string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png#what-ever')).toBe('png')
  })
  it('should ignore any combined query and hash string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png#what-ever?this-is')).toBe('png')
    expect(getExtension('https://ex.am/p.l/thumbnail.png?what-ever#this-is')).toBe('png')
    expect(getExtension('https://ex.am/p.l#serjkd/thumbnail.png?what-ever#this-is')).toBe('l')
  })
  it('should throw if it is no valid url', () => {
    expect(() => getExtension('thumbnail')).toThrow('Invalid URL')
  })
  it('should return empty string if there is no extension', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail')).toBe('')
  })
  it('should return empty string if there is no pathname', () => {
    expect(getExtension('https://ex.am/')).toBe('')
  })
})

describe('determineApiUrl', () => {
  it('should return the default baseURL if no overrideApiUrl is set', async () => {
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual(buildConfig().cmsUrl)
  })
  it('should return the overrideApiUrl if it is set', async () => {
    await appSettings.setSettings({ apiUrlOverride: 'https://super-cool-override-cms.url.com' })
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toBe('https://super-cool-override-cms.url.com')
  })
})

describe('getLocalFilePath', () => {
  const cachedFile = 'resource-cache/v2/testumgebung/files/resource-cache/v2/asdf.png'
  const cachedFileAndroid = `/data/user/0/app.integreat.test/files/${cachedFile}`
  const cachedFileIos = `Users/user/Library/Developer/CoreSimulator/Devices/977988DF-A8BC-4CE5-A27A-75807A6DF085/data/Containers/Data/Application/CBEFC261-5900-4EF9-8646-603BC57B094A/Documents/${cachedFile}`
  const expectedCachedFileAndroid = `file:///data/user/0/app.integreat.test/files/${cachedFile}`
  const expectedCachedFileIos = `~/Documents/${cachedFile}`

  it('should return cached local file for android', () => {
    Platform.OS = 'android'
    expect(getLocalFilePath(cachedFileAndroid)).toBe(expectedCachedFileAndroid)
  })

  it('should return cached local file for ios', () => {
    Platform.OS = 'ios'
    expect(getLocalFilePath(cachedFileIos)).toBe(expectedCachedFileIos)
  })
})

describe('getCachedResource', () => {
  const url = 'https://example.com/asdf.png'
  const cachedFile = 'resource-cache/v2/testumgebung/files/resource-cache/v2/asdf.png'
  const cachedFileAndroid = `/data/user/0/app.integreat.test/files/${cachedFile}`
  const cachedFileIos = `Users/user/Library/Developer/CoreSimulator/Devices/977988DF-A8BC-4CE5-A27A-75807A6DF085/data/Containers/Data/Application/CBEFC261-5900-4EF9-8646-603BC57B094A/Documents/${cachedFile}`
  const expectedCachedFileAndroid = `file:///data/user/0/app.integreat.test/files/${cachedFile}`
  const expectedCachedFileIos = `~/Documents/${cachedFile}`

  it('should return cached local file for android', () => {
    Platform.OS = 'android'
    const resourceCache = {
      [url]: {
        filePath: cachedFileAndroid,
        hash: 'thumbnail-hash',
      },
    }
    expect(getCachedResource(url, { resourceCache })).toBe(expectedCachedFileAndroid)
  })

  it('should return cached local file for ios', () => {
    Platform.OS = 'ios'
    const resourceCache = {
      [url]: {
        filePath: cachedFileIos,
        hash: 'thumbnail-hash',
      },
    }
    expect(getCachedResource(url, { resourceCache })).toBe(expectedCachedFileIos)
  })
})
