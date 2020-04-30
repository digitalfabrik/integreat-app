// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { StateType } from '../../../modules/app/StateType'
import { TFunction } from 'i18next'
import PaginatedList from './../components/PaginatedList'
import { fetchTuNews } from '../actions/fetchTuNews'
import TuNewsElement from './../components/TuNewsElement'
import Tabs from './../components/Tabs'
import {
  TuNewsModel,
  TuNewsElementModel,
} from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'

type PropsType = {|
  tuNewsList: TuNewsModel,
  language: string,
  city: string,
  path: string,
  t: TFunction
|}

class TuNewsListPage extends React.PureComponent<PropsType> {

  renderTuNewsElement = (language: string) => (newsItem: TuNewsElementModel, city: string) => {
    return (
      <TuNewsElement
        newsItem={newsItem}
        key={newsItem.path}
        path={this.props.path}
        t={this.props.t}
        city={city}
        language={language}
        key={newsItem.title}
      />
    )
  }

  render () {
    const { tuNewsList, language, city, t, fetchTuNews, hasMore, isFetching } = this.props

    return (
      <Tabs localNews={false} tuNews={true}>
        {isFetching ? (
          <LoadingSpinner />
        ) : (
          <PaginatedList
            noItemsMessage={t('currentlyNoTuNews')}
            items={tuNewsList}
            renderItem={this.renderTuNewsElement(language)}
            city={city}
            fetchTuNews={fetchTuNews}
            hasMore={hasMore}
          />
        )}
      </Tabs>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  path: state.location.pathname,
  hasMore: state.tunewsList.hasMore,
  isFetching: state.tunewsList._isFetching
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps, { fetchTuNews }),
  withTranslation('tuNewsDetails')
)(TuNewsListPage)
