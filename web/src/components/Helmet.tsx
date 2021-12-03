import React, { ReactElement } from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'

import { CityModel } from 'api-client'

import buildConfig from '../constants/buildConfig'

type PropsType = {
  pageTitle: string
  metaDescription?: string
  languageChangePaths?: Array<{ code: string; path: string | null; name: string }>
  cityModel?: CityModel
}

const Helmet = ({ pageTitle, metaDescription, languageChangePaths, cityModel }: PropsType): ReactElement => {
  const languageLinks =
    languageChangePaths?.map(
      ({ code, path }) =>
        path && <link key={code} rel='alternate' hrefLang={code} href={`${window.location.origin}${path}`} />
    ) ?? null

  const previewImageUrl = new URL(`https://${buildConfig().hostName}`)
  previewImageUrl.pathname = buildConfig().icons.socialMediaPreview

  return (
    <ReactHelmet>
      {pageTitle && <title>{pageTitle}</title>}
      {cityModel && !cityModel.live && <meta name='robots' content='noindex' />}
      <meta name='description' content={metaDescription ?? pageTitle} />
      {languageLinks}
      {/* Tags for a prettier social media preview. See: https://developers.facebook.com/docs/sharing/webmasters */}
      {pageTitle && <meta property='og:title' content={pageTitle} />}
      <meta property='og:image' content={previewImageUrl.href} />
      <meta property='og:description' content={metaDescription ?? pageTitle} />
      <meta property='og:url' content={window.location.href} />
      <meta property='og:type' content='website' />
    </ReactHelmet>
  )
}

export default Helmet
