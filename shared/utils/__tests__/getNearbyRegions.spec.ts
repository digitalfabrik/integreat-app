import LanguageModelBuilder from '../../api/endpoints/testing/LanguageModelBuilder'
import RegionModel from '../../api/models/RegionModel'
import getNearbyRegions from '../getNearbyRegions'

describe('getNearbyRegions', () => {
  const createRegion = (
    longitude: number,
    latitude: number,
    aliases: { [name: string]: { longitude: number; latitude: number } } | null,
  ) =>
    new RegionModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: true,
      poisEnabled: true,
      localNewsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      longitude,
      latitude,
      aliases,
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      chatEnabled: false,
      chatPrivacyPolicyUrl: null,
    })

  const longitude = 10.892578
  const latitude = 48.369696

  const exactRegion = createRegion(longitude, latitude, null)
  const closeAliasRegion = createRegion(0, 0, { alias: { longitude: longitude - 0.005, latitude } })
  const closeRegion = createRegion(longitude - 0.01, latitude, null)
  const stillCloseRegion = createRegion(longitude - 0.02, latitude, null)
  const outsideThresholdRegion1 = createRegion(12.097392, 49.017834, null)
  const outsideThresholdRegion2 = createRegion(0, 0, null)

  it('should return first nearby regions sorted by distance', () => {
    const regions = [
      closeRegion,
      exactRegion,
      outsideThresholdRegion1,
      stillCloseRegion,
      closeAliasRegion,
      outsideThresholdRegion2,
    ]
    expect(getNearbyRegions([longitude, latitude], regions)).toEqual([exactRegion, closeAliasRegion, closeRegion])
  })

  it('should not return regions outside of distance threshold', () => {
    const regions = [outsideThresholdRegion1, stillCloseRegion, closeAliasRegion, outsideThresholdRegion2]
    expect(getNearbyRegions([longitude, latitude], regions)).toEqual([closeAliasRegion, stillCloseRegion])
  })
})
