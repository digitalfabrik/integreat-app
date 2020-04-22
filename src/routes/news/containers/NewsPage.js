// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import NewsList from '../components/NewsList'
import Tabs from '../components/Tabs'
import LocalNewsDetails from '../components/LocalNewsDetails'
import TuNewsDetails from './TuNewsDetails'
import TuNewsElement from '../components/TuNewsElement'

type PropsType = {|
  news: Array < LocalNewsModel >,
    city: string,
      newsId: ?string,
        language: string,
          t: TFunction,
            path: string
              |}

const LOCAL_NEWS = 'local'

/**
 * Displays a list of news or a single newsElement, matching the route /<location>/<language>/news(/<id>)
 */
export class NewsPage extends React.Component<PropsType> {
  state = {
    hasNextPage: true,
    isNextPageLoading: false,
    items: []
  };

  renderLocalNewsElement = (language: string, type: string) => (newsItem: EventModel, city: string) => {
    return (
      <NewsElement
        newsItem={newsItem}
        key={newsItem.path}
        type={type}
        path={this.props.path}
        t={this.props.t}
        city={city}
        language={language}
      />
    )
  }

  render() {
    const { news, path, newsId, city, language, t, tuNews } = this.props
    if (newsId) {
      const newsItem = news.find(_newsItem => {
        return _newsItem.title === decodeURIComponent(newsId)
      })

      if (newsItem) {
        const { title, message, timestamp } = newsItem
        return (
          <>
            <LocalNewsDetails title={title} message={message} timestamp={timestamp} language={language} t={t} />
          </>
        )
      } else {
        const error = new ContentNotFoundError({ type: 'newsItem', id: newsId, city, language })
        return <FailureSwitcher error={error} />
      }
    }
    return (
      <>
        <Tabs>
          {/* TODO: update the locale file realted issues */}
          <div label={t('local')} type={LOCAL_NEWS}>
            <NewsList
              noItemsMessage={t('currentlyNoLocalNews')}
              items={news}
              renderItem={this.renderLocalNewsElement(language, LOCAL_NEWS)}
              path={path}
              city={city}
              language={language}
              t={t}
            />
          </div>
          <div label={t('news.tuNews')} type={TU_NEWS}>
            <NewsList
              noItemsMessage={t('currentlyNoTuNews')}
              items={tuNews}
              renderItem={this.renderTuNewsElement(language, TU_NEWS)}
              path={path}
              city={city}
              language={language}
              t={t}
            />
          </div>
        </Tabs>
      </>
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
    tuNews: state.tunews_list._data
  }
}

export default compose(
  connect(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
