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
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { NEWS_ROUTE } from './../../../modules/app/route-configs/NewsRouteConfig'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'
import {
  TuNewsModel,
  TuNewsElementModel,
  CityModel
} from '@integreat-app/integreat-api-client'

type PropsType = {|
  tuNewsList: TuNewsModel,
  language: string,
  city: string,
  cities: Array<CityModel>,
  path: string,
  t: TFunction,
  redirect: any
|}

class TuNewsListPage extends React.PureComponent<PropsType> {
  componentDidMount() {
    const currentCity: any = this.props.cities.find(cityElement => cityElement._code === this.props.city) || {}

    if (!currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: CATEGORIES_ROUTE })
    }
    else if (currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: NEWS_ROUTE })
    }
  }

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

  render() {
    const { tuNewsList, language, city, path, t, fetchTuNews, hasMore } = this.props
    return (
      <Tabs localNews={false} tuNews={true}>
        <PaginatedList
          noItemsMessage={t('currentlyNoTuNews')}
          items={tuNewsList}
          renderItem={this.renderTuNewsElement(language)}
          city={city}
          fetchTuNews={fetchTuNews}
          hasMore={hasMore}
        />
      </Tabs>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  path: state.location.pathname,
  cities: state.cities._data,
  hasMore: state.tunewsList.hasMore
})

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action)),
  fetchTuNews
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps),
  withTranslation('tuNewsDetails')
)(TuNewsListPage)
