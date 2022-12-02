import React, { useEffect } from 'react'

import Header from '../components/Header'
import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import { CityContentData } from './useLoadCityContent'

type UseHeaderProps<T extends RoutesType> = {
  navigation: NavigationProps<T>
  route: RouteProps<T>
  data: CityContentData<unknown> | null
  availableLanguages?: string[]
  isHome?: boolean
  shareUrl?: string
}

const useHeader = <T extends RoutesType>({
  navigation,
  route,
  availableLanguages,
  data,
  isHome,
  shareUrl,
}: UseHeaderProps<T>): void => {
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          route={route}
          navigation={navigation}
          city={data?.city}
          languages={data?.languages}
          showItems={!!data}
          availableLanguages={availableLanguages}
          isHome={isHome}
          shareUrl={shareUrl}
        />
      ),
    })
  }, [route, navigation, data, availableLanguages, isHome, shareUrl])
}

export default useHeader
