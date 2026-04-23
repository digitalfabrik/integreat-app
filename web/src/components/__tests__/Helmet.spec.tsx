import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { RegionModel, RegionModelBuilder } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import Helmet from '../Helmet'
import { LanguageChangePath } from '../LanguageList'

describe('Helmet', () => {
  const config = buildConfig()

  const regions = new RegionModelBuilder(2).build()
  const liveRegion = regions[0]!
  const hiddenRegion = regions[1]!

  const languageChangePaths: [LanguageChangePath, LanguageChangePath, LanguageChangePath] = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: null },
    { code: 'ar', name: 'Arabic', path: '/augsburg/ar' },
  ]

  const pageTitle = 'PageTitle'
  const metaDescription = 'MetaDescription'

  type RenderHelmetProps = {
    region?: RegionModel
    languageChangePaths?: LanguageChangePath[]
    metaDescription?: string
    rootPage?: boolean
  }
  const renderHelmet = ({ region, languageChangePaths, metaDescription, rootPage }: RenderHelmetProps) =>
    render(
      <Helmet
        pageTitle={pageTitle}
        regionModel={region}
        languageChangePaths={languageChangePaths}
        metaDescription={metaDescription}
        rootPage={rootPage}
      />,
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
    renderHelmet({ region: liveRegion, metaDescription, languageChangePaths })
    await waitFor(() => expect(document.title).toBe(`${pageTitle} | ${buildConfig().appName}`))
    expect(meta('description')).toBe(metaDescription)
    expect(metaByProperty('og:title')).toBe(pageTitle)
    expect(metaByProperty('og:image')).toBe('/social-media-preview.png')
    expect(metaByProperty('og:description')).toBe(metaDescription)
    expect(metaByProperty('og:url')).toBe('http://localhost/')
    expect(metaByProperty('og:type')).toBe('website')
  })

  it('should set root title', async () => {
    renderHelmet({ region: liveRegion, metaDescription, languageChangePaths, rootPage: true })
    await waitFor(() => expect(document.title).toBe(`${buildConfig().appName} | Web-App | ${pageTitle}`))
  })

  it('should fall back to page title if no meta description is available', async () => {
    renderHelmet({ region: liveRegion, languageChangePaths })
    await waitFor(() => expect(meta('description')).toBe(pageTitle))
    expect(metaByProperty('og:description')).toBe(pageTitle)
  })

  it('should not set noindex if no region model passed', async () => {
    renderHelmet({})
    await waitFor(() => expect(document.title).toBe(`${pageTitle} | ${buildConfig().appName}`))
    expect(meta('robots')).toBeUndefined()
  })

  it('should not set noindex if region is live', async () => {
    renderHelmet({ region: liveRegion })
    await waitFor(() => expect(document.title).toBe(`${pageTitle} | ${buildConfig().appName}`))
    expect(meta('robots')).toBeUndefined()
  })

  it('should not set noindex if fixed region set in build config', async () => {
    config.featureFlags.fixedRegion = 'oldtown'
    renderHelmet({ region: hiddenRegion })
    await waitFor(() => expect(document.title).toBe(`${pageTitle} | ${buildConfig().appName}`))
    expect(meta('robots')).toBeUndefined()
    config.featureFlags.fixedRegion = null
  })

  it('should set noindex if region is not live', async () => {
    renderHelmet({ region: hiddenRegion })
    await waitFor(() => expect(document.title).toBe(`${pageTitle} | ${buildConfig().appName}`))
    await waitFor(() => expect(meta('robots')).toBe('noindex'))
  })

  it('should set alternate languages correctly', async () => {
    renderHelmet({ languageChangePaths })
    await waitFor(() => expect(linkByHrefLang(languageChangePaths[0].code)).toBeTruthy())

    expect(linkByHrefLang(languageChangePaths[0].code)?.getAttribute('rel')).toBe('alternate')
    expect(linkByHrefLang(languageChangePaths[0].code)?.getAttribute('href')).toBe(
      `http://localhost${languageChangePaths[0].path}`,
    )

    expect(linkByHrefLang(languageChangePaths[2].code)?.getAttribute('rel')).toBe('alternate')
    expect(linkByHrefLang(languageChangePaths[2].code)?.getAttribute('href')).toBe(
      `http://localhost${languageChangePaths[2].path}`,
    )

    expect(linkByHrefLang(languageChangePaths[1].code)).toBeNull()
  })
})
