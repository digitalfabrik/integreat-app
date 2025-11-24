import { DateTime } from 'luxon'
import React from 'react'

import { CategoryModel } from 'shared/api'

import { cmsApiBaseUrl } from '../../constants/urls'
import { renderWithRouterAndTheme } from '../../testing/render'
import PdfMenuItem from '../PdfMenuItem'

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
  availableLanguages: {},
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
  availableLanguages: { en: '/augsburg/en/anlaufstellen' },
  thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
  lastUpdate: DateTime.fromISO('2017-01-01T05:10:05+02:00'),
  organization: null,
  embeddedOffers: [],
})

describe('PdfMenuItem', () => {
  it('should use the correct PDF URL for a root category', () => {
    const cityCode = 'augsburg'
    const languageCode = 'de'
    const { getByText } = renderWithRouterAndTheme(
      <PdfMenuItem category={rootCategory} cityCode={cityCode} languageCode={languageCode} />,
    )
    const pdfUrlLink = getByText('categories:createPdf').closest('a')

    expect(pdfUrlLink?.href).toBe(`${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`)
  })

  it('should use the correct PDF URL for a non-root category', () => {
    const cityCode = 'augsburg'
    const languageCode = 'de'
    const { getByText } = renderWithRouterAndTheme(
      <PdfMenuItem category={childCategory} cityCode={cityCode} languageCode={languageCode} />,
    )
    const pdfUrlLink = getByText('categories:createPdf').closest('a')

    expect(pdfUrlLink?.href).toBe(
      `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(
        childCategory.path,
      )}`,
    )
  })

  it('should prevent PDF URL for RTL Languages', () => {
    const cityCode = 'augsburg'
    const languageCode = 'ar'
    const { getByText } = renderWithRouterAndTheme(
      <PdfMenuItem category={rootCategory} cityCode={cityCode} languageCode={languageCode} />,
    )
    expect(getByText('categories:createPdf').closest('li')).toHaveClass('Mui-disabled')
  })
})
