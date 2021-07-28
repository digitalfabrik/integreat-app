import React, { ReactNode } from 'react'
import { CityModel } from 'api-client'
import { Helmet as ReactHelmet } from 'react-helmet'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  pageTitle: string
  metaDescription?: string
  languageChangePaths?: Array<{ code: string; path: string | null; name: string }>
  cityModel?: CityModel
}

class Helmet extends React.PureComponent<PropsType> {
  getLanguageLinks(): ReactNode {
    const { languageChangePaths } = this.props
    if (!languageChangePaths) {
      return null
    }

    return languageChangePaths.map(languageChangePath => {
      const { code, path } = languageChangePath
      return path && <link key={code} rel='alternate' hrefLang={code} href={`${window.location.origin}${path}`} />
    })
  }

  render(): ReactNode {
    const { pageTitle, cityModel, metaDescription } = this.props
    const previewImageUrl = new URL(`https://${buildConfig().hostName}`)
    previewImageUrl.pathname = buildConfig().icons.socialMediaPreview

    return (
      <ReactHelmet>
        {pageTitle && <title>{pageTitle}</title>}
        {cityModel && !cityModel.live && <meta name='robots' content='noindex' />}
        <meta name='description' content={metaDescription ?? pageTitle} />
        {this.getLanguageLinks()}
        {/* Tags for a prettier social media preview. See: https://developers.facebook.com/docs/sharing/webmasters */}
        {pageTitle && <meta property='og:title' content={pageTitle} />}
        <meta property='og:image' content={previewImageUrl.href} />
        <meta property='og:description' content={metaDescription ?? pageTitle} />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:type' content='website' />
      </ReactHelmet>
    )
  }
}

export default Helmet
