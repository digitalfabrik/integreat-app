// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux-first-router'
import compose from 'lodash/fp/compose'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
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
  redirect: Action
|}

export class NewsPage extends React.Component<PropsType> {
  renderLocalNewsElement = (language: string) => (newsItem: LocalNewsModel, city: string) => (<NewsElement
    newsItem={newsItem}
    key={newsItem.id}
    path={this.props.path}
    t={this.props.t}
    language={language}
  />)

  render () {
    const { news, city, cities, language, t } = this.props
    return (
      <NewsController>
        <Tabs localNews tunews={false} city={city} cities={cities} t={t} language={language}>
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
    cities: state.cities.data,
    news: state.news.data,
    path: state.location.pathname
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
