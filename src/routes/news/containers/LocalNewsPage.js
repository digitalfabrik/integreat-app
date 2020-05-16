// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { LocalNewsModel, CityModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import LocalNewsList from '../components/LocalNewsList'
import NewsTabs from '../components/NewsTabs'
import { LOCAL_NEWS } from '../constants'

type PropsType = {|
  localNews: Array<LocalNewsModel>,
  city: string,
  cities: Array<CityModel>,
  language: string,
  t: TFunction,
  path: string
|}

export class LocalNewsPage extends React.Component<PropsType> {
  renderLocalNewsElement = (language: string) => (localNewsItem: LocalNewsModel, city: string) => {
    const { id, title, message, timestamp } = localNewsItem
    return <NewsElement
      id={id}
      title={title}
      content={message}
      timestamp={timestamp}
      key={id}
      path={this.props.path}
      t={this.props.t}
      language={language}
      type={LOCAL_NEWS}
    />
  }

  render () {
    const { localNews, city, cities, language, t } = this.props
    return (
      <NewsTabs type={LOCAL_NEWS} city={city} cities={cities} t={t} language={language}>
        <LocalNewsList
          items={localNews}
          noItemsMessage={t('currentlyNoNews')}
          renderItem={this.renderLocalNewsElement(language)}
          city={city}
        />
      </NewsTabs>
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
  connect<PropsType, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('news')
)(LocalNewsPage)
