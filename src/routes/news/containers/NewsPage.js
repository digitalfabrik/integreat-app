// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux-first-router'
import compose from 'lodash/fp/compose'
import { LocalNewsModel, CityModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import NewsList from '../components/NewsList'
import Tabs from '../components/Tabs'
import NewsController from './../containers/NewsController'

type PropsType = {|
  news: Array<LocalNewsModel>,
  city: string,
  language: string,
  t: TFunction,
  path: string,
  cities: Array<CityModel>,
  redirect: Action
|}

export class NewsPage extends React.Component<PropsType> {
  renderLocalNewsElement = (language: string) => (newsItem: LocalNewsModel, city: string) => (<NewsElement
    newsItem={newsItem}
    key={newsItem.path}
    path={this.props.path}
    t={this.props.t}
    language={language}
  />)

  render () {
    const { news, city, language, t } = this.props
    return (
      <NewsController>
        <Tabs localNews={true} tuNews={false}>
          <NewsList items={news} noItemsMessage={t('currentlyNoLocalNews')} renderItem={this.renderLocalNewsElement(language)} city={city} />
        </Tabs>
      </NewsController>
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

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
