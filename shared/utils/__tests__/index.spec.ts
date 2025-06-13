import { DateTime } from 'luxon'

import { CategoriesMapModelBuilder } from '../../api'
import CategoryModel from '../../api/models/CategoryModel'
import OfferModel from '../../api/models/OfferModel'
import TileModel from '../../models/TileModel'
import {
  addSubdomain,
  formatDateICal,
  getGenericLanguageCode,
  getCategoryTiles,
  getSlugFromPath,
  safeParseInt,
  segmentText,
} from '../index'

describe('getSlugFromPath', () => {
  it('should return last path segment', () => {
    expect(getSlugFromPath('')).toBe('')
    expect(getSlugFromPath('https://example.com/path/to/whatever/last')).toBe('last')
    expect(getSlugFromPath('/example/path/to/whatever/last')).toBe('last')
  })
})

describe('formatDateICal', () => {
  it('should return date in iCal format', () => {
    expect(formatDateICal(DateTime.fromISO('2023-10-09T07:00:00.000+02:00'))).toBe('20231009T070000')
  })
})

describe('safeParseInt', () => {
  it('should safely parse', () => {
    expect(safeParseInt(null)).toBeUndefined()
    expect(safeParseInt(undefined)).toBeUndefined()
    expect(safeParseInt(NaN)).toBeUndefined()
    expect(safeParseInt('')).toBeUndefined()
    expect(safeParseInt('asdf123')).toBeUndefined()
    expect(safeParseInt(1234)).toBe(1234)
    expect(safeParseInt('5678')).toBe(5678)
    expect(safeParseInt(0)).toBe(0)
    expect(safeParseInt('0')).toBe(0)
    expect(safeParseInt('-9000')).toBe(-9000)
  })
})
describe('addSubdomain', () => {
  it('should add subdomain', () => {
    expect(() => addSubdomain({ url: '', subdomain: 'test' })).toThrow()
    expect(addSubdomain({ url: 'https://example.com/test', subdomain: '' })).toBe('https://example.com/test')
    expect(addSubdomain({ url: 'https://example.com/test', subdomain: 'subdomain' })).toBe(
      'https://subdomain.example.com/test',
    )
    expect(addSubdomain({ url: 'https://first.example.com/test', subdomain: 'subdomain' })).toBe(
      'https://subdomain.first.example.com/test',
    )
  })
})

describe('getCategoryTiles', () => {
  const categories = new CategoriesMapModelBuilder('soest', 'de').build().toArray().slice(0, 2)
  const category0 = categories[0]!
  const category1 = categories[1]!

  const categoryParams = {
    root: false,
    path: '/random/path',
    title: 'Appointment booking',
    content: 'Some content',
    order: 0,
    availableLanguages: {},
    thumbnail: 'my thumbnail',
    parentPath: '',
    lastUpdate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
    organization: null,
    embeddedOffers: [
      new OfferModel({
        alias: 'terminbuchung',
        thumbnail: 'some_other_thumbnail',
        title: 'Terminbuchung',
        path: 'https://termine.malteapp.de/',
      }),
    ],
  }

  it('should get category tiles', () => {
    expect(getCategoryTiles({ categories, cityCode: 'soest' })).toEqual([
      new TileModel({
        title: category0.title,
        path: category0.path,
        thumbnail: category0.thumbnail,
        isExternalUrl: false,
      }),
      new TileModel({
        title: category1.title,
        path: category1.path,
        thumbnail: category1.thumbnail,
        isExternalUrl: false,
      }),
    ])
  })

  it('should correctly map appointment booking offer', () => {
    const appointmentBookingOffer = new CategoryModel(categoryParams)
    const categories = [appointmentBookingOffer, category0]

    expect(getCategoryTiles({ categories, cityCode: 'soest' })).toEqual([
      new TileModel({
        title: appointmentBookingOffer.title,
        path: 'https://soest.termine.malteapp.de/',
        thumbnail: appointmentBookingOffer.thumbnail,
        isExternalUrl: true,
      }),
      new TileModel({
        title: category0.title,
        path: category0.path,
        thumbnail: category0.thumbnail,
        isExternalUrl: false,
      }),
    ])
  })

  it('should correctly map internal and external offers', () => {
    const internalOfferCategory = new CategoryModel({
      ...categoryParams,
      embeddedOffers: [
        new OfferModel({
          alias: 'sprungbrett',
          thumbnail: 'some_other_thumbnail',
          title: 'Sprungbrett',
          path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
        }),
      ],
    })
    const externalOfferCategory = new CategoryModel({
      ...categoryParams,
      embeddedOffers: [
        new OfferModel({
          alias: 'external',
          thumbnail: 'some_other_thumbnail',
          title: 'External',
          path: 'https://example.com/external-offer',
        }),
      ],
    })
    const categories = [internalOfferCategory, externalOfferCategory]

    expect(getCategoryTiles({ categories, cityCode: 'soest' })).toEqual([
      new TileModel({
        title: internalOfferCategory.title,
        path: internalOfferCategory.path,
        thumbnail: internalOfferCategory.thumbnail,
        isExternalUrl: false,
      }),
      new TileModel({
        title: externalOfferCategory.title,
        path: externalOfferCategory.embeddedOffers[0]!.path,
        thumbnail: externalOfferCategory.thumbnail,
        isExternalUrl: true,
      }),
    ])
  })
})

describe('segmentText', () => {
  it('should filter out empty sentences', () => {
    expect(
      segmentText(
        'Dann könnte Ihnen eine geschulte Person helfen und das Gespräch übersetzen. \n \nKinder oder andere Familien-Mitglieder sind nicht immer passende Personen, wenn Sie eine Übersetzung brauchen.',
        { languageCode: 'de' },
      ),
    ).toEqual([
      'Dann könnte Ihnen eine geschulte Person helfen und das Gespräch übersetzen.',
      'Kinder oder andere Familien-Mitglieder sind nicht immer passende Personen, wenn Sie eine Übersetzung brauchen.',
    ])
  })
})

describe('getGenericLanguageCode', () => {
  it('should return correct generic language code', () => {
    expect(getGenericLanguageCode('de')).toBe('de')
    expect(getGenericLanguageCode('en')).toBe('en')
    expect(getGenericLanguageCode('de-si')).toBe('de')
    expect(getGenericLanguageCode('fr-FR')).toBe('fr')
  })
})
