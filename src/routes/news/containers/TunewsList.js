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
import Tabs from '../components/Tabs'
import { TunewsModel } from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import NewsController from './NewsController'

type PropsType = {|
  tunewsList: TunewsModel,
  language: string,
  city: string,
  path: string,
  t: TFunction
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
    const { tunewsList, language, city, t, fetchTunews, hasMore, isFetchingFirstTime, isFetching, resetTunews, cities } = this.props
    return (
      <NewsController>
        <Tabs localNews={false} tunews city={city} cities={cities} t={t} language={language}>
          {isFetchingFirstTime ? (
            <LoadingSpinner />
          ) : (
            <PaginatedList
              items={tunewsList}
              renderItem={this.renderTunewsElement(language)}
              city={city}
              fetchTunews={fetchTunews}
              resetTunews={resetTunews}
              hasMore={hasMore}
              isFetching={isFetching}
              language={language}
              noItemsMessage={t('currentlyNoTunews')}
            />
          )}
        </Tabs>
      </NewsController>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  cities: state.cities.data,
  path: state.location.pathname,
  hasMore: state.tunewsList.hasMore,
  isFetchingFirstTime: state.tunewsList.isFetchingFirstTime,
  isFetching: state.tunewsList._isFetching
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps, { fetchTunews, resetTunews }),
  withTranslation('news')
)(TunewsListPage)
