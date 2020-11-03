// @flow

import * as React from 'react'
import { CityModel } from 'api-client'
import { Helmet as ReactHelmet } from 'react-helmet'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'

type PropsType = {|
  pageTitle: ?string,
  metaDescription: ?string,
  languageChangePaths: ?LanguageChangePathsType,
  cityModel: ?CityModel
|}

class Helmet extends React.PureComponent<PropsType> {
  getLanguageLinks (): React.Node {
    const { languageChangePaths } = this.props
    if (!languageChangePaths) {
      return null
    }

    return languageChangePaths.map(languageChangePath => {
      const { code, path } = languageChangePath
      return path && <link key={code} rel='alternate' hrefLang={code} href={path} />
    })
  }

  render () {
    const { pageTitle, cityModel, metaDescription } = this.props

    return <ReactHelmet>
      {pageTitle && <title>{pageTitle}</title>}
      {cityModel && !cityModel.live && <meta name='robots' content='noindex' />}
      {metaDescription && <meta name='description' content={metaDescription} />}
      {this.getLanguageLinks()}
    </ReactHelmet>
  }
}

export default Helmet
