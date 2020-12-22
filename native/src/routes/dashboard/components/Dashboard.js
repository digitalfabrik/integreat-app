// @flow

import * as React from 'react'
import type { NavigationStackProp } from 'react-navigation-stack'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from 'build-configs/ThemeType'
import { CityModel } from 'api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import NavigationTiles from '../../../modules/common/components/NavigationTiles'
import TileModel from '../../../modules/common/models/TileModel'
import eventsIcon from '../assets/events.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import newsIcon from '../assets/news.svg'
import localInformationIcon from '../assets/local_information.svg'
import type { TFunction } from 'react-i18next'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToInternalLinkParamsType } from '../../../modules/app/createNavigateToInternalLink'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'
import buildConfig from '../../../modules/app/constants/buildConfig'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import type { NavigateToPoiParamsType } from '../../../modules/app/createNavigateToPoi'
import { LOCAL_NEWS, TUNEWS } from '../../../modules/endpoint/constants'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'

const Spacing: StyledComponent<{||}, ThemeType, *> = styled.View`
  padding: 10px;
`

export type PropsType = {|
  navigation: NavigationStackProp<*>,

  navigateToPoi: NavigateToPoiParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToInternalLink: NavigateToInternalLinkParamsType => void,
  navigateToNews: NavigateToNewsParamsType => void,
  navigateToOffers: ({| cityCode: string, language: string |}) => void,
  theme: ThemeType,

  language: string,
  cityModel: CityModel,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  t: TFunction
|}

class Dashboard extends React.Component<PropsType> {
  getNavigationTileModels (): Array<TileModel> {
    const {
      navigateToCategory,
      navigateToEvent,
      navigateToPoi,
      navigateToOffers,
      navigateToNews,
      cityModel,
      language,
      t
    } = this.props

    const { featureFlags } = buildConfig()
    const { tunewsEnabled, pushNotificationsEnabled, code: cityCode } = cityModel
    const isNewsEnabled = tunewsEnabled || pushNotificationsEnabled

    const tiles = [
      new TileModel({
        title: t('localInformation'),
        path: 'categories',
        thumbnail: localInformationIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToCategory({
          cityCode,
          language,
          path: `/${cityCode}/${language}`
        }),
        notifications: 0
      })]

    if (featureFlags.newsStream && isNewsEnabled) {
      tiles.push(new TileModel({
        title: t('news'),
        path: 'news',
        thumbnail: newsIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToNews({
          cityCode,
          language,
          newsId: null,
          type: pushNotificationsEnabled ? LOCAL_NEWS : TUNEWS
        }),
        notifications: 0
      }))
    }

    if (cityModel.eventsEnabled) {
      tiles.push(new TileModel({
        title: t('events'),
        path: 'events',
        thumbnail: eventsIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToEvent({
          cityCode,
          language,
          path: null
        }),
        notifications: 0
      }))
    }

    if (cityModel.offersEnabled) {
      tiles.push(new TileModel({
        title: t('offers'),
        path: 'offers',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToOffers({
          cityCode,
          language
        }),
        notifications: 0
      }))
    }

    if (cityModel.poisEnabled && featureFlags.pois) {
      tiles.push(new TileModel({
        title: t('pois'),
        path: 'pois',
        thumbnail: poisIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToPoi({
          cityCode,
          language,
          path: null
        }),
        notifications: 0
      }))
    }

    return tiles
  }

  render () {
    const {
      stateView,
      theme,
      resourceCache,
      resourceCacheUrl,
      navigateToInternalLink,
      language,
      cityModel,
      navigateToCategory,
      navigation,
      t
    } = this.props

    const navigationTiles = this.getNavigationTileModels()

    return (
      <SpaceBetween>
        {navigationTiles.length > 1
          ? <NavigationTiles tiles={navigationTiles} theme={theme} language={language} />
          : <Spacing />}
        <Categories
          stateView={stateView}
          resourceCache={resourceCache}
          resourceCacheUrl={resourceCacheUrl}
          language={language}
          cityModel={cityModel}
          theme={theme}
          navigation={navigation}
          navigateToCategory={navigateToCategory}
          t={t}
          navigateToInternalLink={navigateToInternalLink}
        />
      </SpaceBetween>
    )
  }
}

export default Dashboard
