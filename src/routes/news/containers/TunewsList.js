// @flow

import * as React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { StateType } from '../../../modules/app/StateType'
import { TFunction } from 'i18next'
import PaginatedList from '../components/PaginatedList'
import { fetchTunews, resetTunews } from '../actions/fetchTunews'
import TunewsElement from '../components/TunewsElement'
import NewsTabs from '../components/NewsTabs'
import { TunewsModel, CityModel } from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import NewsController from './NewsController'

type PropsType = {|
  tunews: Array<TunewsModel>,
  language: string,
  city: string,
  cities: Array<CityModel>,
  path: string,
  t: TFunction,
  isFetching: boolean,
  isFetchingFirstTime: boolean,
  hasMore: boolean,
  fetchTunews: () => void,
  resetTunews: () => void
|}

export class TunewsListPage extends React.PureComponent<PropsType> {
  renderTunewsElement = (language: string) => (newsItem: TunewsModel, city: string) => {
    const { path, t } = this.props
    return (
      <TunewsElement
        newsItem={newsItem}
        key={newsItem.id}
        path={path}
        t={t}
        city={city}
        language={language}
      />
    )
  }

  render () {
    const { tunews, language, city, t, fetchTunews, hasMore, isFetchingFirstTime, isFetching, resetTunews, cities } = this.props
    return (
      <NewsController>
        <NewsTabs localNews={false} tunews city={city} cities={cities} t={t} language={language}>
          {isFetchingFirstTime ? (
            <LoadingSpinner />
          ) : (
            <PaginatedList
              items={tunews}
              renderItem={this.renderTunewsElement(language)}
              city={city}
              fetchTunews={fetchTunews}
              resetTunews={resetTunews}
              hasMore={hasMore}
              isFetching={isFetching}
              language={language}
              noItemsMessage={t('currentlyNoNews')}
            />
          )}
        </NewsTabs>
      </NewsController>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  cities: state.cities.data,
  path: state.location.pathname,
  hasMore: state.tunews.hasMore,
  isFetchingFirstTime: state.tunews.isFetchingFirstTime,
  isFetching: state.tunews._isFetching
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps, { fetchTunews, resetTunews }),
  withTranslation('news')
)(TunewsListPage)
