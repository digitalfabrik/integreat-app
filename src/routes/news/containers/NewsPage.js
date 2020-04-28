// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { LocalNewsModel, TuNewsElementModel, CityModel } from '@integreat-app/integreat-api-client'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import NewsList from '../components/NewsList'
import Tabs from '../components/Tabs'
import LocalNewsDetailsPage from './../containers/LocalNewsDetails'
import TuNewsDetails from './TuNewsDetails'
import TuNewsElement from '../components/TuNewsElement'
import Link from 'redux-first-router-link'
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { TUNEWS_LIST_ROUTE } from './../../../modules/app/route-configs/TuNewsListRouteConfig'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'

type PropsType = {|
  news: Array<LocalNewsModel>,
  city: string,
  language: string,
  t: TFunction,
  path: string,
  cities: Array<CityModel>,
  redirect: any,
|}

/**
 * Displays a list of news or a single newsElement, matching the route /<location>/<language>/news(/<id>)
 */
export class NewsPage extends React.Component<PropsType> {

  componentDidMount() {

    const currentCity: any = this.props.cities.find(cityElement => cityElement._code === this.props.city) || {}

    if (!currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: CATEGORIES_ROUTE })
    }
    else if (!currentCity.newsEnabled && currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: TUNEWS_LIST_ROUTE})
    }
  }

  renderLocalNewsElement = (language: string) => (newsItem: LocalNewsModel, city: string) => (<NewsElement
    newsItem={newsItem}
    key={newsItem.path}
    path={this.props.path}
    t={this.props.t}
    language={language}
  />)

  render() {
    const { news, city, language, t, path, cities } = this.props
      return (
        <Tabs localNews={true} tuNews={false}>
          <NewsList items={news} noItemsMessage={t("currentlyNoLocalNews")} renderItem={this.renderLocalNewsElement(language)} city={city}/>
        </Tabs>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    language: state.location.payload.language,
    city: state.location.payload.city,
    news: state.news.data,
    path: state.location.pathname,
    location: state.location,
    cities: state.cities._data,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action))
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps, mapDispatchToProps),
  withTranslation('news')
)(NewsPage)
