import React, { useEffect } from 'react'

import Header from '../components/Header'
import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import { CityContentData } from './useLoadCityContent'

type UseHeaderProps<T extends RoutesType> = {
  navigation: NavigationProps<T>
  route: RouteProps<T>
  data: CityContentData | null
  availableLanguages?: string[]
  shareUrl?: string
}

const useHeader = <T extends RoutesType>({
  navigation,
  route,
  availableLanguages,
  data,
  shareUrl,
}: UseHeaderProps<T>): void => {
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          route={route}
          navigation={navigation}
          languages={data?.languages}
          showItems={!!data}
          availableLanguages={availableLanguages}
          shareUrl={shareUrl}
        />
      ),
    })
  }, [route, navigation, data, availableLanguages, shareUrl])
}

export default useHeader
