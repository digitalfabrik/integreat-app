import { Settings } from 'luxon'

import PlaceModelBuilder from '../../api/endpoints/testing/PlaceModelBuilder'
import { LocationType } from '../../constants/map'
import { prepareMapFeatures } from '../geoJson'
import { preparePlaces, sortPlaces } from '../places'

const places = new PlaceModelBuilder(3).build()
const place1 = places[0]!
const place2 = places[1]!
const place3 = places[2]!

jest.useFakeTimers({ now: new Date('2023-10-02T15:23:57.443+02:00') })

describe('sortPlaces', () => {
  const longitude = 30
  const latitude = 30
  const userLocation: LocationType = [longitude, latitude]

  it('should sort features by distance ascending', () => {
    expect(sortPlaces([place2, place1, place3], userLocation)).toEqual([place1, place3, place2])
  })

  it('should sort features by name ascending', () => {
    expect(sortPlaces([place2, place1, place3], null)).toEqual([place3, place1, place2])
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
    expect(place2.isCurrentlyOpen).toBe(true)
  })

  it('should return true when currently open in New York at 07:00 and it is not all day', () => {
    Settings.defaultZone = 'America/New_York'
    expect(place2.isCurrentlyOpen).toBe(true)
  })

  it('should return false when closed in Auckland at 01:00 and it is not all day', () => {
    Settings.defaultZone = 'Pacific/Auckland'
    expect(place2.isCurrentlyOpen).toBe(false)
  })

  it('should return true when it is all day despite New York time at 07:00', () => {
    Settings.defaultZone = 'America/New_York'
    expect(place1.isCurrentlyOpen).toBe(true)
  })
})

describe('preparePlaces', () => {
  it('should apply filters', () => {
    const data1 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: undefined, placeCategoryId: 10, currentlyOpen: true },
    })
    expect(data1.places).toEqual([place1])
    expect(data1.mapFeatures).toEqual(prepareMapFeatures([place1]))
    expect(data1.place).toBeUndefined()
    expect(data1.mapFeature).toBeUndefined()

    const data2 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: undefined, placeCategoryId: 6, currentlyOpen: true },
    })
    expect(data2.places).toEqual([place2])
    expect(data2.mapFeatures).toEqual(prepareMapFeatures([place2]))
    expect(data2.place).toBeUndefined()
    expect(data2.mapFeature).toBeUndefined()

    const data3 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: undefined, placeCategoryId: 10, currentlyOpen: undefined },
    })
    expect(data3.places).toEqual([place1, place3])
    expect(data3.mapFeatures).toEqual(prepareMapFeatures([place1, place3]))
    expect(data3.place).toBeUndefined()
    expect(data3.mapFeature).toBeUndefined()

    const data4 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: undefined, placeCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data4.places).toEqual([place1, place2, place3])
    expect(data4.mapFeatures).toEqual(prepareMapFeatures([place1, place2, place3]))
    expect(data4.place).toBeUndefined()
    expect(data4.mapFeature).toBeUndefined()
  })

  it('should handle multipois correctly', () => {
    const data1 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: 0, placeCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data1.places).toEqual([place1, place3])
    expect(data1.mapFeatures).toEqual(prepareMapFeatures([place1, place2, place3]))
    expect(data1.mapFeature).toEqual(prepareMapFeatures([place1, place3])[0])
    expect(data1.place).toBeUndefined()

    const data2 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: 0, placeCategoryId: undefined, currentlyOpen: true },
    })
    expect(data2.places).toEqual([place1])
    expect(data2.mapFeatures).toEqual(prepareMapFeatures([place1, place2]))
    expect(data2.mapFeature).toEqual(prepareMapFeatures([place1])[0])
    expect(data2.place).toBeUndefined()

    const data3 = preparePlaces({
      places,
      params: { slug: undefined, multipoi: 2, placeCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data3.places).toEqual([place1, place2, place3])
    expect(data3.mapFeatures).toEqual(prepareMapFeatures([place1, place2, place3]))
    expect(data3.mapFeature).toBeUndefined()
    expect(data3.place).toBeUndefined()
  })

  it('should handle slugs correctly', () => {
    const data1 = preparePlaces({
      places,
      params: { slug: 'test', multipoi: undefined, placeCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data1.places).toEqual([place1, place2, place3])
    expect(data1.mapFeatures).toEqual(prepareMapFeatures([place1, place2, place3]))
    expect(data1.mapFeature).toEqual(prepareMapFeatures([place1, place3])[0])
    expect(data1.place).toEqual(place1)

    const data2 = preparePlaces({
      places,
      params: { slug: 'another_test_path', multipoi: 0, placeCategoryId: undefined, currentlyOpen: undefined },
    })
    expect(data2.places).toEqual([place1, place3])
    expect(data2.mapFeatures).toEqual(prepareMapFeatures([place1, place2, place3]))
    expect(data2.mapFeature).toEqual(prepareMapFeatures([place1, place2, place3])[0])
    expect(data2.place).toEqual(place3)

    const data3 = preparePlaces({
      places,
      params: { slug: 'test', multipoi: 0, placeCategoryId: undefined, currentlyOpen: true },
    })
    expect(data3.places).toEqual([place1])
    expect(data3.mapFeatures).toEqual(prepareMapFeatures([place1, place2]))
    expect(data3.mapFeature).toEqual(prepareMapFeatures([place1])[0])
    expect(data3.place).toEqual(place1)
  })

  it('should prepare place categories', () => {
    const { placeCategories: placeCategories1, placeCategory: placeCategory1 } = preparePlaces({
      places,
      params: { slug: 'test', multipoi: 0, placeCategoryId: undefined, currentlyOpen: true },
    })
    expect(placeCategories1).toEqual([place2.category, place3.category])
    expect(placeCategory1).toBeUndefined()

    const { placeCategories: placeCategories2, placeCategory: placeCategory2 } = preparePlaces({
      places: [...places, ...places],
      params: { slug: 'test', multipoi: 0, placeCategoryId: 10, currentlyOpen: true },
    })
    expect(placeCategories2).toEqual([place2.category, place3.category])
    expect(placeCategory2).toEqual(place1.category)
  })
})
