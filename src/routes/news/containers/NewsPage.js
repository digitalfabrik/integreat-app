// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { LocalNewsModel, TuNewsElementModel } from '@integreat-app/integreat-api-client'
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


type PropsType = {|
  news: Array<LocalNewsModel>,
  city: string,
  newsId: ?string,
  language: string,
  t: TFunction,
  path: string
|}

/**
 * Displays a list of news or a single newsElement, matching the route /<location>/<language>/news(/<id>)
 */
export class NewsPage extends React.Component<PropsType> {
  state: any = {
    hasNextPage: true,
    isNextPageLoading: false,
    items: []
  };

  renderLocalNewsElement = (language: string) => (newsItem: LocalNewsModel, city: string) => (<NewsElement
    newsItem={newsItem}
    key={newsItem.path}
    path={this.props.path}
    t={this.props.t}
    language={language}
  />)

  render() {
    const { news,city, newsId, language, t, path } = this.props
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
    newsId: state.location.payload.newsId,
    path: state.location.pathname,
    location: state.location
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
