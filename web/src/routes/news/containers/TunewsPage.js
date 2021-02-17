// @flow

import * as React from 'react'
import { useContext } from 'react'
import { type TFunction, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import TunewsList from '../components/TunewsList'
import NewsElement from '../components/NewsElement'
import NewsTabs from '../components/NewsTabs'
import { CityModel, NotFoundError, TunewsModel } from 'api-client'
import { TU_NEWS } from '../constants'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { fetchTunews } from '../actions/fetchTunews'
import TunewsDetailsRouteConfig from '../../../modules/app/route-configs/TunewsDetailsRouteConfig'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

type PropsType = {|
  tunews: Array<TunewsModel>,
  language: string,
  city: string,
  cities: ? Array<CityModel>,
  path: string,
  t: TFunction,
  isFetching: boolean,
  hasMore: boolean,
  fetchTunews: () => void
|}

export const TunewsPage = ({
  tunews,
  language,
  city,
  t,
  fetchTunews,
  hasMore,
  isFetching,
  cities,
  path
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)

  const renderTunewsElement = (city: string, language: string) => ({
    id,
    title,
    content,
    date
  }: TunewsModel, city: string) => {
    return (
      <NewsElement
        title={title}
        content={content}
        timestamp={date}
        key={id}
        t={t}
        link={new TunewsDetailsRouteConfig().getRoutePath({
          city,
          language,
          id
        })}
        formatter={formatter}
        type={TU_NEWS}
      />
    )
  }

  const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
  if (!currentCity || !currentCity.tunewsEnabled) {
    const error = new NotFoundError({ type: 'category', id: path, city: city, language })
    return <FailureSwitcher error={error} />
  }

  return (
    <NewsTabs type={TU_NEWS}
              city={city}
              tunewsEnabled={currentCity.tunewsEnabled}
              localNewsEnabled={currentCity.pushNotificationsEnabled}
              t={t}
              language={language}>
      <TunewsList
        items={tunews}
        renderItem={renderTunewsElement(city, language)}
        city={city}
        fetchMoreTunews={fetchTunews}
        hasMore={hasMore}
        isFetching={isFetching}
        language={language}
        noItemsMessage={t('currentlyNoNews')}
      />
    </NewsTabs>
  )
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  cities: state.cities.data,
  path: state.location.pathname,
  hasMore: state.tunews.hasMore,
  tunews: state.tunews.allData,
  isFetching: state.tunews.payload.isFetching
})

export default connect<$Diff<PropsType, {| t: TFunction |}>, {||}, _, _, _, _>(mapStateToProps, { fetchTunews })(
  withTranslation<PropsType>('news')(
    TunewsPage
  ))
