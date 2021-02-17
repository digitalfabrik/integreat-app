// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CityModel, LocalNewsModel, NotFoundError } from 'api-client'
import { withTranslation, TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import LocalNewsList from '../components/LocalNewsList'
import NewsTabs from '../components/NewsTabs'
import { LOCAL_NEWS } from '../constants'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import LocalNewsDetailsRouteConfig from '../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'
import { useContext } from 'react'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

type PropsType = {|
  localNews: Array<LocalNewsModel>,
  city: string,
  cities: Array<CityModel>,
  areCitiesFetching: boolean,
  language: string,
  t: typeof TFunction,
  path: string
|}

export const LocalNewsPage = ({
  localNews,
  city,
  cities,
  areCitiesFetching,
  path,
  language,
  t
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  const renderLocalNewsElement = (city: string, language: string) => (localNewsItem: LocalNewsModel) => {
    const {
      id,
      title,
      message,
      timestamp
    } = localNewsItem
    return <NewsElement
      title={title}
      content={message}
      timestamp={timestamp}
      key={id}
      link={new LocalNewsDetailsRouteConfig().getRoutePath({
        city,
        language,
        id
      })}
      t={t}
      formatter={formatter}
      type={LOCAL_NEWS}
    />
  }

  if (areCitiesFetching) {
    return <LoadingSpinner />
  }

  const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
  if (!currentCity || !currentCity.pushNotificationsEnabled) {
    const error = new NotFoundError({ type: 'category', id: path, city: city, language })
    return <FailureSwitcher error={error} />
  }

  return (
    <NewsTabs type={LOCAL_NEWS}
              city={city}
              tunewsEnabled={currentCity.tunewsEnabled}
              localNewsEnabled={currentCity.pushNotificationsEnabled}
              t={t}
              language={language}>
      <LocalNewsList
        items={localNews}
        noItemsMessage={t('currentlyNoNews')}
        renderItem={renderLocalNewsElement(city, language)}
        city={city}
      />
    </NewsTabs>
  )
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
