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
import NewsListItem from '../components/NewsListItem'
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

  renderNewsListItem = (language: string, type: string) => (newsItem: EventModel) => (
    <NewsListItem newsItem={newsItem} language={language} key={newsItem.path} type={type} path={this.props.path} />
  )

  render () {
    const { news, path, newsId, city, language, t } = this.props

    if (newsId) {
      const newsItem = news.find(_newsItem => {
        return _newsItem.title === decodeURIComponent(newsId)
      })

      if (newsItem) {
        const { title, message, timestap } = newsItem
        return (
          <>
            <PushNewsDetails title={title} message={message} timestap={timestap} />
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
          <div label={t('LOCAL NEWS')} type={LOCAL_NEWS}>
            <NewsList
              noItemsMessage={t('currentlyNoEvents')}
              isNewsList
              items={news}
              renderItem={this.renderNewsListItem(language, LOCAL_NEWS)}
              path={path}
              city={city}
              language={language}
              t={t}
            />
          </div>
          <div label={t('News')} type={TU_NEWS}>
            <NewsList
              noItemsMessage={t('currentlyNoEvents')}
              isNewsList
              // items={news}
              renderItem={this.renderNewsListItem(language, TU_NEWS)}
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
    path: state.location.pathname
  }
}

export default compose(
  connect(mapStateTypeToProps),
  withTranslation('news')
)(NewsPage)
