// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Page from 'modules/common/components/Page'
import CityModel from 'modules/endpoint/models/CityModel'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import type { StateType } from 'modules/app/StateType'
import Helmet from 'modules/common/containers/Helmet'
import CategoryTimeStamp from '../../categories/components/CategoryTimeStamp'
import { pathToAction, setKind } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { ReceivedAction } from 'redux-first-router/dist/flow-types'

type PropsType = {|
  disclaimer: DisclaimerModel,
  cities: Array<CityModel>,
  city: string,
  t: TFunction,
  language: string,
  dispatch: ReceivedAction => void,
  routesMap: {}
|}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<PropsType> {
  redirectToPath = (path: string) => {
    const action = pathToAction(path, this.props.routesMap)
    setKind(action, 'push')
    this.props.dispatch(action)
  }

  render () {
    const {disclaimer, cities, city, t, language} = this.props

    return <>
      <Helmet title={`${t('pageTitle')} - ${CityModel.findCityName(cities, city)}`} />
      <Page title={disclaimer.title} content={disclaimer.content} onInternLinkClick={this.redirectToPath} />
      <CategoryTimeStamp lastUpdate={disclaimer.lastUpdate} language={language} />
    </>
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  city: stateType.location.payload.city,
  language: stateType.location.payload.language
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  dispatch
})

export default compose(
  connect(mapStateTypeToProps, mapDispatchToProps),
  translate('disclaimer')
)(DisclaimerPage)
