// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { LocalNewsModel, CityModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import NewsList from '../components/NewsList'
import NewsTabs from '../components/NewsTabs'
import NewsController from './../containers/NewsController'

type PropsType = {|
  localNews: Array<LocalNewsModel>,
  city: string,
  cities: Array<CityModel>,
  language: string,
  t: TFunction,
  path: string
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
    const { localNews, city, cities, language, t } = this.props
    return (
      <NewsController>
        <NewsTabs localNews tunews={false} city={city} cities={cities} t={t} language={language}>
          <NewsList items={localNews} noItemsMessage={t('currentlyNoNews')} renderItem={this.renderLocalNewsElement(language)} city={city} />
        </NewsTabs>
      </NewsController>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    language: state.location.payload.language,
    city: state.location.payload.city,
    cities: state.cities.data,
    localNews: state.localNews.data,
    path: state.location.pathname
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
