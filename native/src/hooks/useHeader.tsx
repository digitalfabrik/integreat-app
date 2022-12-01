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
}

const useHeader = <T extends RoutesType>({
  navigation,
  route,
  availableLanguages,
  data,
  isHome,
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
        />
      ),
    })
  }, [route, navigation, data, availableLanguages, isHome])
}

export default useHeader
