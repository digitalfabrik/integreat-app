// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { push } from 'redux-first-router'
import { CityModel, LocalNewsModel, NotFoundError } from 'api-client'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

type PropsType = {|
  localNewsElement: LocalNewsModel,
  language: string,
  city: string,
  id: string,
  cities: Array<CityModel>
|}

export class LocalNewsDetailsPage extends React.PureComponent<PropsType> {
  render () {
    const { localNewsElement, language, city, cities, id } = this.props

    const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
    if (!currentCity || !currentCity.pushNotificationsEnabled) {
      const error = new NotFoundError({ type: 'category', id, city, language })
      return <FailureSwitcher error={error} />
    } else if (!localNewsElement) {
      const error = new NotFoundError({ type: 'tunews', id, city, language })
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
    id: state.location.payload.id,
    cities: state.cities.data
  }
)

export default connect<PropsType, *, *, *, *, *>(mapStateTypeToProps)(LocalNewsDetailsPage)
