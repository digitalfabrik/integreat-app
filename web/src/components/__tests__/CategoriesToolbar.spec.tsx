import { render, screen } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { CategoryModel } from 'api-client'

import { cmsApiBaseUrl } from '../../constants/urls'
import CategoriesToolbar from '../CategoriesToolbar'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

const CategoryParams = new CategoryModel({
  root: true,
  path: '/augsburg/de/willkommen',
  parentPath: '/augsburg/de',
  title: 'willkommen',
  order: 1,
  availableLanguages: new Map(),
  content: 'exampleContent0',
  lastUpdate: DateTime.fromISO('2016-01-07 10:36:24'),
  thumbnail: 'thumb-nail',
  organization: null,
})

const cityCode = 'FR'
const languageCode = 'fr'

describe('CategoriesToolbar', () => {
  it('Correct PDF URL for root category', () => {
    const pdfUrl = `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
    expect(pdfUrl).toBe(pdfUrl)
  })

  it('Correct PDF URL for non-root category', () => {
    const pdfUrl = `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(
      CategoryParams.path,
    )}`
    expect(pdfUrl).toBe(pdfUrl)
  })
})
