import React, { ReactNode } from 'react'
import { CityModel } from 'api-client'
import { Helmet as ReactHelmet } from 'react-helmet'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  pageTitle: string | null
  metaDescription: string | null
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  cityModel: CityModel | null
}

class Helmet extends React.PureComponent<PropsType> {
  getLanguageLinks(): ReactNode {
    const { languageChangePaths } = this.props
    if (!languageChangePaths) {
      return null
    }

    return languageChangePaths.map(languageChangePath => {
      const { code, path } = languageChangePath
      return path && <link key={code} rel='alternate' hrefLang={code} href={path} />
    })
  }

  render() {
    const { pageTitle, cityModel, metaDescription } = this.props
    const previewImageUrl = new URL(`https://${buildConfig().hostName}`)
    previewImageUrl.pathname = buildConfig().icons.socialMediaPreview

    return (
      <ReactHelmet>
        {pageTitle && <title>{pageTitle}</title>}
        {cityModel && !cityModel.live && <meta name='robots' content='noindex' />}
        {metaDescription && <meta name='description' content={metaDescription} />}
        {this.getLanguageLinks()}
        {/* Tags for a prettier social media preview. See: https://developers.facebook.com/docs/sharing/webmasters */}
        {pageTitle && <meta property='og:title' content={pageTitle} />}
        <meta property='og:image' content={previewImageUrl.href} />
        {metaDescription && <meta property='og:description' content={metaDescription} />}
        <meta property='og:url' content={window.location.href} />
        <meta property='og:type' content='website' />
      </ReactHelmet>
    )
  }
}

export default Helmet
