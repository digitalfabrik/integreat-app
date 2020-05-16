// @flow

import * as React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { StateType } from '../../../modules/app/StateType'
import { TFunction } from 'i18next'
import TunewsList from '../components/TunewsList'
import { fetchMoreTunews } from '../actions/fetchMoreTunews'
import NewsElement from '../components/NewsElement'
import NewsTabs from '../components/NewsTabs'
import { TunewsModel, CityModel } from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import { TU_NEWS } from '../constants'

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
  fetchMoreTunews: () => void
|}

export class TunewsPage extends React.PureComponent<PropsType> {
  renderTunewsElement = (language: string) => (tunewsItem: TunewsModel, city: string) => {
    const { path, t } = this.props
    const { id, title, content, date } = tunewsItem
    return (
      <NewsElement
        id={id}
        title={title}
        content={content}
        timestamp={date}
        key={id}
        path={path}
        t={t}
        language={language}
        type={TU_NEWS}
      />
    )
  }

  render () {
    const { tunews, language, city, t, fetchMoreTunews, hasMore, isFetchingFirstTime, isFetching, cities } = this.props
    return (
      <NewsTabs type={TU_NEWS} city={city} cities={cities} t={t} language={language}>
        {isFetchingFirstTime ? (
          <LoadingSpinner />
        ) : (
          <TunewsList
            items={tunews}
            renderItem={this.renderTunewsElement(language)}
            city={city}
            fetchMoreTunews={fetchMoreTunews}
            hasMore={hasMore}
            isFetching={isFetching}
            language={language}
            noItemsMessage={t('currentlyNoNews')}
          />
        )}
      </NewsTabs>
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
  isFetching: state.tunews.isFetching
})

export default compose(
  connect<PropsType, *, *, *, *, *>(mapStateToProps, { fetchMoreTunews }),
  withTranslation('news')
)(TunewsPage)
