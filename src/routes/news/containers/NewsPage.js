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
import PushNewsDetails from '../components/PushNewsDetails'

type PropsType = {|
  news: Array<LocalNewsModel>,
  city: string,
  newsId: ?string,
  language: string,
  t: TFunction,
  path: string
|}

const LOCAL_NEWS = 'local'
const TU_NEWS = 'tu'

/**
 * Displays a list of news or a single newsElement, matching the route /<location>/<language>/news(/<id>)
 */
export class NewsPage extends React.Component<PropsType> {
  state = {
    hasNextPage: true,
    isNextPageLoading: false,
    items: []
  };

  renderNewsElement = (language: string, type: string) => (newsItem: EventModel) => (
    <NewsElement newsItem={newsItem} language={language} key={newsItem.path} type={type} path={this.props.path} />
  )

  render () {
    const { news, path, newsId, city, language, t } = this.props

    if (newsId) {
      const newsItem = news.find(_newsItem => {
        return _newsItem.title === decodeURIComponent(newsId)
      })

      if (newsItem) {
        const { title, message, timestamp } = newsItem
        return (
          <>
            <PushNewsDetails title={title} message={message} timestamp={timestamp} language={language} />
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
          <div label={t('LOKALE NEWS')} type={LOCAL_NEWS}>
            <NewsList
              noItemsMessage={t('currentlyNoEvents')}
              isNewsList
              items={news}
              renderItem={this.renderNewsElement(language, LOCAL_NEWS)}
              path={path}
              city={city}
              language={language}
              t={t}
            />
          </div>
          <div label={t('News')} type={TU_NEWS}>
            {/* TODO: TuNews list goes here */}
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
    path: state.location.pathname
  }
}

export default compose(
  connect(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
