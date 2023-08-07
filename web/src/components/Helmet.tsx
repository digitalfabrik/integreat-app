import React, { ReactElement } from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'

import { CityModel } from 'api-client'

import buildConfig from '../constants/buildConfig'

type HelmetProps = {
  pageTitle: string
  metaDescription?: string | null
  languageChangePaths?: Array<{ code: string; path: string | null; name: string }>
  cityModel?: CityModel
}

const Helmet = ({ pageTitle, metaDescription, languageChangePaths, cityModel }: HelmetProps): ReactElement => {
  const languageLinks =
    languageChangePaths?.map(
      ({ code, path }) =>
        path && <link key={code} rel='alternate' hrefLang={code} href={`${window.location.origin}${path}`} />
    ) ?? null

  const noIndex =
    cityModel && !cityModel.live && !buildConfig().featureFlags.fixedCity ? (
      <meta name='robots' content='noindex' />
    ) : null

  const title = `${pageTitle} | ${buildConfig().hostName}`
  const description = metaDescription ?? pageTitle
  const previewImage = buildConfig().icons.socialMediaPreview

  return (
    <ReactHelmet>
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
      <meta property='integreat:version' content={__VERSION_NAME__} />
    </ReactHelmet>
  )
}

export default Helmet
