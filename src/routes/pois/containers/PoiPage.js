// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { TFunction } from 'react-i18next'
import { withNamespaces } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import Helmet from '../../../modules/common/containers/Helmet'
import { pathToAction, setKind } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { ReceivedAction } from 'redux-first-router/dist/flow-types'
import PageDetail from '../../../modules/common/components/PageDetail'
import PoiModel from '../../../modules/endpoint/models/PoiModel'
import PoiListItem from '../components/PoiListItem'
import Caption from '../../../modules/common/components/Caption'
import List from '../../../modules/common/components/List'

type PropsType = {|
  pois: Array<PoiModel>,
  city: string,
  poiId: ?string,
  language: string,
  cities: Array<CityModel>,
  t: TFunction,
  dispatch: ReceivedAction => void,
  path: string,
  routesMap: {}
|}

/**
 * Displays a list of pois or a single poi, matching the route /<city>/<language>/locations(/<id>)
 */
export class PoiPage extends React.Component<PropsType> {
  renderPoiListItem = (poi: PoiModel) => <PoiListItem key={poi.path} poi={poi} />

  redirectToPath = (path: string) => {
    const action = pathToAction(path, this.props.routesMap)
    setKind(action, 'push')
    this.props.dispatch(action)
  }

  render () {
    const {pois, path, poiId, city, language, cities, t} = this.props
    if (poiId) {
      const poi = pois.find(_poi => _poi.path === path)

      if (poi) {
        return <>
          <Helmet title={`${poi.title} - ${CityModel.findCityName(cities, city)}`} />
          <Page thumbnail={poi.thumbnail}
                lastUpdate={poi.lastUpdate}
                content={poi.content}
                title={poi.title}
                language={language}
                onInternalLinkClick={this.redirectToPath}>
            <PageDetail identifier={t('location')} information={poi.location.location} />
          </Page>
        </>
      } else {
        const error = new ContentNotFoundError({type: 'poi', id: poiId, city, language})
        return <FailureSwitcher error={error} />
      }
    }

    const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))
    return <>
      <Helmet title={`${t('pageTitle')} - ${CityModel.findCityName(cities, city)}`} />
      <Caption title={t('pois')} />
      <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={this.renderPoiListItem} />
    </>
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  poiId: state.location.payload.poiId,
  path: state.location.pathname
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  dispatch
})

export default compose(
  connect(mapStateTypeToProps, mapDispatchToProps),
  withNamespaces('pois')
)(PoiPage)
