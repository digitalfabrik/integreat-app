// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { push } from 'redux-first-router'
import { CityModel, LocalNewsModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

type PropsType = {|
  localNewsElement: LocalNewsModel,
  language: string,
  city: string,
  path: string,
  cities: Array<CityModel>,
  t: TFunction
|}

export class LocalNewsDetailsPage extends React.PureComponent<PropsType> {
  render () {
    const { localNewsElement, language, city, path, cities } = this.props

    const currentCity: CityModel = cities && cities.find(cityElement => cityElement.code === city)
    if (!localNewsElement || !currentCity.pushNotificationsEnabled) {
      const type: string = currentCity.pushNotificationsEnabled ? 'localNewsItem' : 'category'
      const error = new ContentNotFoundError({ type, id: path, city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <Page
        title={localNewsElement.title}
        content={localNewsElement.message}
        language={language}
        lastUpdate={localNewsElement.timestamp}
        onInternalLinkClick={push}
      />
    )
  }
}

const mapStateTypeToProps = (state: StateType) => (
  {
    language: state.location.payload.language,
    city: state.location.payload.city,
    path: state.location.pathname,
    cities: state.cities.data
  }
)

export default connect<PropsType, *, *, *, *, *>(mapStateTypeToProps)(LocalNewsDetailsPage)
