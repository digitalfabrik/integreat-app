import { Settings } from 'luxon'

import PoiModelBuilder from '../../api/endpoints/testing/PoiModelBuilder'
import { LocationType } from '../../constants/maps'
import { prepareMapFeatures } from '../geoJson'
import { preparePois, sortPois } from '../pois'

const pois = new PoiModelBuilder(3).build()
const poi1 = pois[0]!
const poi2 = pois[1]!
const poi3 = pois[2]!

jest.useFakeTimers({ now: new Date('2023-10-02T15:23:57.443+02:00') })

describe('sortPois', () => {
  const longitude = 30
  const latitude = 30
  const userLocation: LocationType = [longitude, latitude]

  it('should sort features by distance ascending', () => {
    expect(sortPois([poi2, poi1, poi3], userLocation)).toEqual([poi1, poi3, poi2])
  })

  it('should sort features by name ascending', () => {
    expect(sortPois([poi2, poi1, poi3], null)).toEqual([poi3, poi1, poi2])
  })
})

describe('isCurrentlyOpen', () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2025-10-13T13:00:00.443+02:00') })
  })
  afterEach(() => {
    Settings.defaultZone = 'system'
  })

  it('should return true when currently open in Berlin at 13:00 and it is not all day', () => {
    Settings.defaultZone = 'Europe/Berlin'
    expect(poi2.isCurrentlyOpen).toBe(true)
  })

  it('should return true when currently open in New York at 07:00 and it is not all day', () => {
    Settings.defaultZone = 'America/New_York'
    expect(poi2.isCurrentlyOpen).toBe(true)
  })

  it('should return false when closed in Auckland at 01:00 and it is not all day', () => {
    Settings.defaultZone = 'Pacific/Auckland'
    expect(poi2.isCurrentlyOpen).toBe(false)
  })

  it('should return true when it is all day despite New York time at 07:00', () => {
    Settings.defaultZone = 'America/New_York'
    expect(poi1.isCurrentlyOpen).toBe(true)
  })
})

describe('preparePois', () => {
  it('should apply filters', () => {
    const data1 = preparePois({
      pois,
      params: { slug: undefined, multipoi: undefined, poiCategoryId: 10, currentlyOpen: true },
    })
    expect(data1.pois).toEqual([poi1])
    expect(data1.mapFeatures).toEqual(prepareMapFeatures([poi1]))
    expect(data1.poi).toBeUndefined()
    expect(data1.mapFeature).toBeUndefined()

    const data2 = preparePois({
      pois,
      params: { slug: undefined, multipoi: undefined, poiCategoryId: 6, currentlyOpen: true },
    })
    expect(data2.pois).toEqual([poi2])
    expect(data2.mapFeatures).toEqual(prepareMapFeatures([poi2]))
    expect(data2.poi).toBeUndefined()
    expect(data2.mapFeature).toBeUndefined()

    const data3 = preparePois({
      pois,
      params: { slug: undefined, multipoi: undefined, poiCategoryId: 10, currentlyOpen: undefined },
    })
    expect(data3.pois).toEqual([poi1, poi3])
    expect(data3.mapFeatures).toEqual(prepareMapFeatures([poi1, poi3]))
    expect(data3.poi).toBeUndefined()
    expect(data3.mapFeature).toBeUndefined()

    const data4 = preparePois({
      pois,
      params: { slug: undefined, multipoi: undefined, poiCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data4.pois).toEqual([poi1, poi2, poi3])
    expect(data4.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2, poi3]))
    expect(data4.poi).toBeUndefined()
    expect(data4.mapFeature).toBeUndefined()
  })

  it('should handle multipois correctly', () => {
    const data1 = preparePois({
      pois,
      params: { slug: undefined, multipoi: 0, poiCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data1.pois).toEqual([poi1, poi3])
    expect(data1.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2, poi3]))
    expect(data1.mapFeature).toEqual(prepareMapFeatures([poi1, poi3])[0])
    expect(data1.poi).toBeUndefined()

    const data2 = preparePois({
      pois,
      params: { slug: undefined, multipoi: 0, poiCategoryId: undefined, currentlyOpen: true },
    })
    expect(data2.pois).toEqual([poi1])
    expect(data2.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2]))
    expect(data2.mapFeature).toEqual(prepareMapFeatures([poi1])[0])
    expect(data2.poi).toBeUndefined()

    const data3 = preparePois({
      pois,
      params: { slug: undefined, multipoi: 2, poiCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data3.pois).toEqual([poi1, poi2, poi3])
    expect(data3.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2, poi3]))
    expect(data3.mapFeature).toBeUndefined()
    expect(data3.poi).toBeUndefined()
  })

  it('should handle slugs correctly', () => {
    const data1 = preparePois({
      pois,
      params: { slug: 'test', multipoi: undefined, poiCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data1.pois).toEqual([poi1, poi2, poi3])
    expect(data1.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2, poi3]))
    expect(data1.mapFeature).toEqual(prepareMapFeatures([poi1, poi3])[0])
    expect(data1.poi).toEqual(poi1)

    const data2 = preparePois({
      pois,
      params: { slug: 'another_test_path', multipoi: 0, poiCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data2.pois).toEqual([poi1, poi3])
    expect(data2.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2, poi3]))
    expect(data2.mapFeature).toEqual(prepareMapFeatures([poi1, poi2, poi3])[0])
    expect(data2.poi).toEqual(poi3)

    const data3 = preparePois({
      pois,
      params: { slug: 'test', multipoi: 0, poiCategoryId: undefined, currentlyOpen: true },
    })
    expect(data3.pois).toEqual([poi1])
    expect(data3.mapFeatures).toEqual(prepareMapFeatures([poi1, poi2]))
    expect(data3.mapFeature).toEqual(prepareMapFeatures([poi1])[0])
    expect(data3.poi).toEqual(poi1)
  })

  it('should prepare poi categories', () => {
    const { poiCategories: poiCategories1, poiCategory: poiCategory1 } = preparePois({
      pois,
      params: { slug: 'test', multipoi: 0, poiCategoryId: undefined, currentlyOpen: true },
    })
    expect(poiCategories1).toEqual([poi2.category, poi3.category])
    expect(poiCategory1).toBeUndefined()

    const { poiCategories: poiCategories2, poiCategory: poiCategory2 } = preparePois({
      pois: [...pois, ...pois],
      params: { slug: 'test', multipoi: 0, poiCategoryId: 10, currentlyOpen: true },
    })
    expect(poiCategories2).toEqual([poi2.category, poi3.category])
    expect(poiCategory2).toEqual(poi1.category)
  })
})
