import React, { ReactElement, useEffect } from 'react'

import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { LanguageChangePath } from './LanguageList'

type HelmetProps = {
  pageTitle: string
  metaDescription?: string | null
  languageChangePaths?: LanguageChangePath[]
  rootPage?: boolean
  cityModel?: CityModel
}

/** Make sure to render at most one Helmet instance at any time (to avoid having multiple title, description tags in the DOM). */
const Helmet = ({
  pageTitle,
  metaDescription,
  languageChangePaths,
  cityModel,
  rootPage = false,
}: HelmetProps): ReactElement => {
  const languageLinks =
    languageChangePaths?.map(
      ({ code, path }) =>
        path && <link key={code} rel='alternate' hrefLang={code} href={`${window.location.origin}${path}`} />,
    ) ?? null

  const noIndex =
    cityModel && !cityModel.live && !buildConfig().featureFlags.fixedCity ? (
      <meta name='robots' content='noindex' />
    ) : null

  const title = rootPage
    ? `${buildConfig().appName} | Web-App | ${pageTitle}`
    : `${pageTitle} | ${buildConfig().appName}`
  const description = metaDescription ?? pageTitle
  const previewImage = buildConfig().icons.socialMediaPreview

  // While this instance of Helmet is being rendered, we replace the defaults established in index.ejs.
  useEffect(() => {
    const defaultTags = [...document.head.querySelectorAll('*[data-helmet]')]
    defaultTags.forEach(it => it.remove())
    return () => {
      defaultTags.forEach(it => document.head.appendChild(it))
    }
  }, [])

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      {noIndex}
      {languageLinks}
      {/* Tags for a prettier social media preview. See: https://developers.facebook.com/docs/sharing/webmasters */}
      <meta property='og:title' content={pageTitle} />
      <meta property='og:image' content={previewImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={window.location.href} />
      <meta property='og:type' content='website' />
      <meta name='twitter:title' content={pageTitle} />
      <meta name='twitter:image' content={previewImage} />
      <meta property='integreat:version' content={__VERSION_NAME__} />
    </>
  )
}

export default Helmet
