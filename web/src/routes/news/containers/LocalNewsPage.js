// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CityModel, LocalNewsModel } from 'api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import LocalNewsList from '../components/LocalNewsList'
import NewsTabs from '../components/NewsTabs'
import { LOCAL_NEWS } from '../constants'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityNotFoundError from '../../../modules/app/errors/CityNotFoundError'
import LocalNewsDetailsRouteConfig from '../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'

type PropsType = {|
  localNews: Array<LocalNewsModel>,
  city: string,
  cities: Array<CityModel>,
  areCitiesFetching: boolean,
  language: string,
  t: TFunction,
  path: string
|}

export class LocalNewsPage extends React.Component<PropsType> {
  renderLocalNewsElement = (city: string, language: string) => (localNewsItem: LocalNewsModel) => {
    const { id, title, message, timestamp } = localNewsItem
    return <NewsElement
      id={id}
      title={title}
      content={message}
      timestamp={timestamp}
      key={id}
      link={new LocalNewsDetailsRouteConfig().getRoutePath({ city, language, id })}
      t={this.props.t}
      language={language}
      type={LOCAL_NEWS}
    />
  }

  render () {
    const { localNews, city, cities, areCitiesFetching, path, language, t } = this.props

    if (areCitiesFetching) {
      return <LoadingSpinner />
    }

    const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
    if (!currentCity) {
      return <FailureSwitcher error={new CityNotFoundError()} />
    } else if (!currentCity.pushNotificationsEnabled) {
      const error = new ContentNotFoundError({ type: 'category', id: path, city: city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <NewsTabs type={LOCAL_NEWS} city={city} cities={cities} t={t} language={language}>
        <LocalNewsList
          items={localNews}
          noItemsMessage={t('currentlyNoNews')}
          renderItem={this.renderLocalNewsElement(city, language)}
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
    areCitiesFetching: state.cities.isFetching,
    localNews: state.localNews.data,
    path: state.location.pathname
  }
}

export default connect<PropsType, *, *, *, *, *>(mapStateTypeToProps)(
  withTranslation('news')(
    LocalNewsPage
  ))
