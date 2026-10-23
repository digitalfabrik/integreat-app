import MenuList from '@mui/material/MenuList'
import { fireEvent } from '@testing-library/dom'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'

import { CategoriesMapModelBuilder, CategoryModel } from 'shared/api'

import { cmsApiBaseUrl } from '../../constants/urls'
import { renderWithRouterAndTheme } from '../../testing/render'
import PdfMenuItem from '../PdfMenuItem'

// MenuItem requires a MenuList/Menu ancestor, as it has in the app via HeaderMenu
const renderInMenu = (ui: ReactElement) => renderWithRouterAndTheme(<MenuList>{ui}</MenuList>)

const rootCategory = new CategoryModel({
  id: -1,
  root: true,
  path: '/augsburg/de',
  title: 'augsburg',
  parentPath: '',
  content: '',
  thumbnail: '',
  order: -1,
  availableLanguages: {},
  lastUpdate: DateTime.fromMillis(0),
  publishedAt: DateTime.fromMillis(0),
  organization: null,
  embeddedOffers: [],
  slugHistory: [],
})

const childCategory = new CategoryModel({
  id: 1,
  root: false,
  path: '/augsburg/de/anlaufstellen',
  title: 'Anlaufstellen zu sonstigen Themen',
  content: '<div>Some category test content :)</div>',
  parentPath: '/augsburg/de',
  order: 75,
  availableLanguages: { en: '/augsburg/en/anlaufstellen' },
  thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
  lastUpdate: DateTime.fromISO('2017-01-01T05:10:05+02:00'),
  publishedAt: DateTime.fromISO('2017-01-01T05:10:05+02:00'),
  organization: null,
  embeddedOffers: [],
  slugHistory: [],
})

describe('PdfMenuItem', () => {
  it('should use the correct PDF URL for a root category', () => {
    const regionCode = 'augsburg'
    const languageCode = 'de'
    const { getByText } = renderInMenu(
      <PdfMenuItem category={rootCategory} regionCode={regionCode} languageCode={languageCode} />,
    )
    const pdfUrlLink = getByText('categories:pdf.create').closest('a')

    expect(pdfUrlLink?.href).toBe(`${cmsApiBaseUrl}/${regionCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`)
  })

  it('should use the correct PDF URL for a non-root category', () => {
    const regionCode = 'augsburg'
    const languageCode = 'de'
    const { getByText } = renderInMenu(
      <PdfMenuItem category={childCategory} regionCode={regionCode} languageCode={languageCode} />,
    )
    const pdfUrlLink = getByText('categories:pdf.create').closest('a')

    expect(pdfUrlLink?.href).toBe(
      `${cmsApiBaseUrl}/${regionCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(
        childCategory.path,
      )}`,
    )
  })

  it.each(['ar', 'ckb', 'pes', 'prs', 'ps', 'ur', 'de', 'en'])(
    'should offer an enabled PDF link for %s',
    languageCode => {
      const { getByRole } = renderInMenu(<PdfMenuItem regionCode='augsburg' languageCode={languageCode} />)
      const pdfMenuItem = getByRole('menuitem', { name: 'categories:pdf.create' })

      expect(pdfMenuItem.tagName).toBe('A')
      expect(pdfMenuItem).toHaveAttribute('href', `${cmsApiBaseUrl}/augsburg/${languageCode}/wp-json/ig-mpdf/v1/pdf`)
      expect(pdfMenuItem).not.toHaveAttribute('aria-disabled', 'true')
    },
  )

  it('should link to an RTL child category PDF', () => {
    const category = new CategoriesMapModelBuilder('augsburg', 'ar').build().toArray()[3]!
    const { getByRole } = renderInMenu(<PdfMenuItem category={category} regionCode='augsburg' languageCode='ar' />)

    expect(getByRole('menuitem', { name: 'categories:pdf.create' })).toHaveAttribute(
      'href',
      `${cmsApiBaseUrl}/augsburg/ar/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`,
    )
  })

  it('should close the menu when an RTL PDF link is clicked', () => {
    const regionCode = 'augsburg'
    const languageCode = 'ar'
    const closeMenu = jest.fn()
    const { getByRole } = renderInMenu(
      <PdfMenuItem category={rootCategory} regionCode={regionCode} languageCode={languageCode} closeMenu={closeMenu} />,
    )

    fireEvent.click(getByRole('menuitem', { name: 'categories:pdf.create' }))

    expect(closeMenu).toHaveBeenCalledTimes(1)
  })
})
