import { DateTime } from 'luxon'
import React from 'react'

import { CategoryModel } from 'shared/api'

import { cmsApiBaseUrl } from '../../constants/urls'
import { renderWithTheme } from '../../testing/render'
import CategoriesToolbar from '../CategoriesToolbar'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))

const rootCategory = new CategoryModel({
  root: true,
  path: '/augsburg/de',
  title: 'augsburg',
  parentPath: '',
  content: '',
  thumbnail: '',
  order: -1,
  availableLanguages: new Map(),
  lastUpdate: DateTime.fromMillis(0),
  organization: null,
  embeddedOffers: [],
})

const childCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/anlaufstellen',
  title: 'Anlaufstellen zu sonstigen Themen',
  content: '<div>Some category test content :)</div>',
  parentPath: '/augsburg/de',
  order: 75,
  availableLanguages: new Map([['en', '/augsburg/en/anlaufstellen']]),
  thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
  lastUpdate: DateTime.fromISO('2017-01-01T05:10:05+02:00'),
  organization: null,
  embeddedOffers: [],
})

describe('CategoriesToolbar', () => {
  it('should use the correct PDF URL for a root category', () => {
    const cityCode = 'augsburg'
    const languageCode = 'de'
    const { getByText } = renderWithTheme(
      <CategoriesToolbar category={rootCategory} cityCode={cityCode} languageCode={languageCode} pageTitle='Test' />,
    )
    const pdfUrlLink = getByText('categories:createPdf').closest('a')

    expect(pdfUrlLink?.href).toBe(`${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`)
  })

  it('should use the correct PDF URL for a non-root category', () => {
    const cityCode = 'augsburg'
    const languageCode = 'de'
    const { getByText } = renderWithTheme(
      <CategoriesToolbar category={childCategory} cityCode={cityCode} languageCode={languageCode} pageTitle='Test' />,
    )
    const pdfUrlLink = getByText('categories:createPdf').closest('a')

    expect(pdfUrlLink?.href).toBe(
      `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(
        childCategory.path,
      )}`,
    )
  })
})
