// @flow

import * as React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import ReactHelmet from 'react-helmet'
import map from 'lodash/map'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'

type PropsType = {|
  pageTitle: string,
  metaDescription: ?string,
  languageChangePaths: ?LanguageChangePathsType,
  cityModel: ?CityModel
|}

export class Helmet extends React.Component<PropsType> {
  getLanguageLinks (): React.Node {
    const {languageChangePaths} = this.props
    if (!languageChangePaths) {
      return null
    }

    return map(languageChangePaths, (value, key: string) => {
      return <link key={key} rel='alternate' hrefLang={key} href={value.path} />
    })
  }

  render () {
    const {pageTitle, cityModel, metaDescription} = this.props

    return <ReactHelmet>
      <title>{pageTitle}</title>
      {cityModel && !cityModel.live && <meta name='robots' content='noindex' />}
      {metaDescription && <meta name='description' content={metaDescription} />}
      {this.getLanguageLinks()}
    </ReactHelmet>
  }
}

export default Helmet
