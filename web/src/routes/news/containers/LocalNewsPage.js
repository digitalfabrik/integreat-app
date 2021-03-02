// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CityModel, LocalNewsModel, NotFoundError } from 'api-client'
import { withTranslation, type TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import NewsElement from '../components/NewsElement'
import LocalNewsList from '../components/LocalNewsList'
import NewsTabs from '../components/NewsTabs'
import { LOCAL_NEWS } from '../constants'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import LocalNewsDetailsRouteConfig from '../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'
import { useContext } from 'react'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

type OwnPropsType = {|
  cities: Array<CityModel>,
  localNews: Array<LocalNewsModel>
|}

type PropsType = {|
  ...OwnPropsType,
  city: string,
  language: string,
  t: TFunction,
  path: string
|}

export const LocalNewsPage = ({ localNews, city, cities, path, language, t }: PropsType) => {
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

  const currentCity: ?CityModel = cities.find(cityElement => cityElement.code === city)
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
    path: state.location.pathname
  }
}

export default connect<$Diff<PropsType, {| t: TFunction |}>, OwnPropsType, _, _, _, _>(mapStateTypeToProps, () => ({}))(
  withTranslation<PropsType>('news')(
    LocalNewsPage
  ))
