// @flow

import * as React from 'react'
import { CityModel } from 'api-client'
import { Helmet as ReactHelmet } from 'react-helmet'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  pageTitle: ?string,
  metaDescription: ?string,
  languageChangePaths: ?LanguageChangePathsType,
  cityModel: ?CityModel
|}

class Helmet extends React.PureComponent<PropsType> {
  getLanguageLinks(): React.Node {
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
