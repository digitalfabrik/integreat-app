// @flow

import * as React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { StateType } from '../../../modules/app/StateType'
import { TFunction } from 'i18next'
import PaginatedList from './../components/PaginatedList'
import { fetchTuNews, resetTuNews } from '../actions/fetchTuNews'
import TuNewsElement from './../components/TuNewsElement'
import Tabs from './../components/Tabs'
import {
  TuNewsModel,
  TuNewsElementModel
} from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import NewsController from './../containers/NewsController'

type PropsType = {|
  tuNewsList: TuNewsModel,
  language: string,
  city: string,
  path: string,
  t: TFunction
|}

class TuNewsListPage extends React.PureComponent<PropsType> {
  renderTuNewsElement = (language: string) => (newsItem: TuNewsElementModel, city: string) => {
    const { path, t } = this.props
    return (
      <TuNewsElement
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
    const { tuNewsList, language, city, t, fetchTuNews, hasMore, isFetchingFirstTime, isFetching, resetTuNews, cities } = this.props
    return (
      <NewsController>
        <Tabs localNews={false} tuNews city={city} cities={cities} t={t} language={language}>
          {isFetchingFirstTime ? (
            <LoadingSpinner />
          ) : (
            <PaginatedList
              items={tuNewsList}
              renderItem={this.renderTuNewsElement(language)}
              city={city}
              fetchTuNews={fetchTuNews}
              resetTuNews={resetTuNews}
              hasMore={hasMore}
              isFetching={isFetching}
              language={language}
              noItemsMessage={t('currentlyNoTuNews')}
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
  connect<*, *, *, *, *, *>(mapStateToProps, { fetchTuNews, resetTuNews }),
  withTranslation('news')
)(TuNewsListPage)
