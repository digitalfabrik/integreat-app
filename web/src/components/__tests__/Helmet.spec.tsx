import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { CityModel, CityModelBuilder } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import Helmet from '../Helmet'

describe('Helmet', () => {
  const config = buildConfig()

  const cities = new CityModelBuilder(2).build()
  const liveCity = cities[0]!
  const hiddenCity = cities[1]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: null },
    { code: 'ar', name: 'Arabic', path: '/augsburg/ar' }
  ]

  const pageTitle = 'PageTitle'
  const metaDescription = 'MetaDescription'

  type Props = {
    city?: CityModel
    languageChangePaths?: Array<{ code: string; path: string | null; name: string }>
    metaDescription?: string
  }
  const renderHelmet = ({ city, languageChangePaths, metaDescription }: Props) =>
    render(
      <Helmet
        pageTitle={pageTitle}
        cityModel={city}
        languageChangePaths={languageChangePaths}
        metaDescription={metaDescription}
      />
    )

  const meta = (name: string) => document.getElementsByTagName('meta').namedItem(name)?.getAttribute('content')

  const metaByProperty = (property: string) => {
    const metas = document.getElementsByTagName('meta')
    for (let i = 0; i < metas.length; i += 1) {
      if (metas[i]!.getAttribute('property') === property) {
        return metas[i]!.getAttribute('content')
      }
    }
    return null
  }

  const linkByHrefLang = (code: string) => {
    const links = document.getElementsByTagName('link')
    for (let i = 0; i < links.length; i += 1) {
      if (links[i]!.getAttribute('hrefLang') === code) {
        return links[i]
      }
    }
    return null
  }

  it('should set title and meta tags', async () => {
    renderHelmet({ city: liveCity, metaDescription, languageChangePaths })
    await waitFor(() => expect(document.title).toBe(pageTitle))
    expect(meta('description')).toBe(metaDescription)
    expect(metaByProperty('og:title')).toBe(pageTitle)
    expect(metaByProperty('og:image')).toBe('https://integreat.app/social-media-preview.png')
    expect(metaByProperty('og:description')).toBe(metaDescription)
    expect(metaByProperty('og:url')).toBe('http://localhost/')
    expect(metaByProperty('og:type')).toBe('website')
  })

  it('should fall back to page title if no meta description is available', async () => {
    renderHelmet({ city: liveCity, languageChangePaths })
    await waitFor(() => expect(meta('description')).toBe(pageTitle))
    expect(metaByProperty('og:description')).toBe(pageTitle)
  })

  it('should not set noindex if no city model passed', async () => {
    renderHelmet({})
    await waitFor(() => expect(document.title).toBe(pageTitle))
    expect(meta('robots')).toBe(undefined)
  })

  it('should not set noindex if city is live', async () => {
    renderHelmet({ city: liveCity })
    await waitFor(() => expect(document.title).toBe(pageTitle))
    expect(meta('robots')).toBe(undefined)
  })

  it('should not set noindex if fixed city set in build config', async () => {
    config.featureFlags.fixedCity = 'oldtown'
    renderHelmet({ city: hiddenCity })
    await waitFor(() => expect(document.title).toBe(pageTitle))
    expect(meta('robots')).toBe(undefined)
    config.featureFlags.fixedCity = null
  })

  it('should set noindex if city is not live', async () => {
    renderHelmet({ city: hiddenCity })
    await waitFor(() => expect(document.title).toBe(pageTitle))
    await waitFor(() => expect(meta('robots')).toBe('noindex'))
  })

  it('should set alternate languages correctly', async () => {
    renderHelmet({ languageChangePaths })
    await waitFor(() => expect(linkByHrefLang(languageChangePaths[0]!.code)).toBeTruthy())

    languageChangePaths.forEach(({ code, path }) => {
      const link = linkByHrefLang(code)
      if (path) {
        expect(link?.getAttribute('rel')).toBe('alternate')
        expect(link?.getAttribute('href')).toBe(`http://localhost${path}`)
      } else {
        expect(link).toBe(null)
      }
    })
  })
})
