import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants'
import LocationModel from '../../models/LocationModel'
import PlaceCategoryModel from '../../models/PlaceCategoryModel'
import PlaceModel from '../../models/PlaceModel'
import { JsonPlaceType } from '../../types'
import createPLACEsEndpoint from '../createPlacesEndpoint'

describe('places', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const places = createPLACEsEndpoint(baseUrl)
  const path = '/augsburg/de/places/asylpolitischer_fruehschoppen'

  const createPlace = (id: number): JsonPlaceType => ({
    id,
    path,
    url: baseUrl + path,
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    meta_description: 'Meta',
    content: '<p>Am Sonntag...</p>',
    available_languages: {},
    thumbnail: '',
    contacts: [],
    category: {
      color: '#1DC6C6',
      icon: 'gastronomy',
      id: 10,
      name: 'Gastronomie',
      icon_url: 'https://example.com/icon',
    },
    location: {
      id: 1,
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353',
      country: 'DE',
      longitude: 10.89779,
      latitude: 48.3705449,
    },
    last_updated: '2017-01-09T15:30:00+02:00',
    temporarily_closed: false,
    appointment_url: 'https://set.up/an/appointment',
    opening_hours: null,
    organization: null,
    barrier_free: null,
  })

  const createPlaceModel = () =>
    new PlaceModel({
      path,
      title: 'Asylploitischer Frühschoppen',
      excerpt: 'Am Sonntag...',
      metaDescription: 'Meta',
      content: '<p>Am Sonntag...</p>',
      availableLanguages: {},
      thumbnail: '',
      contacts: [],
      category: new PlaceCategoryModel({
        color: '#1DC6C6',
        iconName: 'gastronomy',
        id: 10,
        name: 'Gastronomie',
        icon: 'https://example.com/icon',
      }),
      location: new LocationModel({
        id: 1,
        name: 'Café Tür an Tür',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        postcode: '86353',
        country: 'DE',
        longitude: 10.89779,
        latitude: 48.3705449,
      }),
      lastUpdate: DateTime.fromISO('2017-01-09T15:30:00+02:00'),
      temporarilyClosed: false,
      openingHours: null,
      appointmentUrl: 'https://set.up/an/appointment',
      organization: null,
      barrierFree: null,
    })

  const place1 = createPlace(2730)
  const place2 = createPlace(1889)
  const place3 = createPlace(4768) // we get these from cms
  const place4 = createPlace(4826)

  const placeModel1 = createPlaceModel()
  const placeModel2 = createPlaceModel()
  const placeModel3 = createPlaceModel()
  const placeModel4 = createPlaceModel()
  const params = {
    region: 'augsburg',
    language: 'de',
  }
  it('should map params to url', () => {
    expect(places.mapParamsToUrl(params)).toBe(
      `https://integreat-api-url.de/api/${API_VERSION}/augsburg/de/locations/?on_map=1`,
    )
  })
  const json = [place1, place2, place3, place4]
  it('should map fetched data to models', () => {
    const placesModels = places.mapResponse(json, params)
    const value = [placeModel1, placeModel2, placeModel3, placeModel4]
    expect(placesModels).toEqual(value)
  })
})
