import { Platform } from 'react-native'

import getCachedThumbnail from '../getCachedThumbnail'

describe('getCachedThumbnail', () => {
  const thumbnail = 'https://example.com/asdf.jpg'
  const cachedThumbnail = 'resource-cache/v1/testumgebung/files/resource-cache/v1/asdf.png'
  const cachedThumbnailAndroid = `/data/user/0/app.integreat.test/files/${cachedThumbnail}`
  const cachedThumbnailIos = `Users/user/Library/Developer/CoreSimulator/Devices/977988DF-A8BC-4CE5-A27A-75807A6DF085/data/Containers/Data/Application/CBEFC261-5900-4EF9-8646-603BC57B094A/Documents/${cachedThumbnail}`
  const expectedCachedThumbnailAndroid = `file:///data/user/0/app.integreat.test/files/${cachedThumbnail}`
  const expectedCachedThumbnailIos = `~/Documents/${cachedThumbnail}`

  it('should return cached thumbnail for android', () => {
    Platform.OS = 'android'
    expect(
      getCachedThumbnail(thumbnail, {
        [thumbnail]: {
          filePath: cachedThumbnailAndroid,
          hash: 'f325a546afbf8045765887a160251552',
        },
      }),
    ).toBe(expectedCachedThumbnailAndroid)
  })

  it('should return cached thumbnail for ios', () => {
    Platform.OS = 'ios'
    expect(
      getCachedThumbnail(thumbnail, {
        [thumbnail]: {
          filePath: cachedThumbnailIos,
          hash: 'f325a546afbf8045765887a160251552',
        },
      }),
    ).toBe(expectedCachedThumbnailIos)
  })

  it('should return thumbnail if not cached', () => {
    expect(getCachedThumbnail(thumbnail, {})).toBe(thumbnail)
  })
})
