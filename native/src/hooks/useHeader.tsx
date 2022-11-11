import React, { useEffect } from 'react'

import { CityModel, LanguageModel } from 'api-client'

import Header from '../components/Header'
import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'

type UseHeaderProps<T extends RoutesType> = {
  navigation: NavigationProps<T>
  route: RouteProps<T>
  languageCode: string
  city?: CityModel
  languages?: LanguageModel[]
  availableLanguages?: string[]
}

const useHeader = <T extends RoutesType>({
  navigation,
  route,
  availableLanguages,
  city,
  languageCode,
  languages,
}: UseHeaderProps<T>): void => {
  useEffect(() => {
    const goToLanguageChange =
      city && availableLanguages && languages
        ? () => {
            navigateToLanguageChange({
              navigation,
              languageCode,
              languages,
              cityCode: city.code,
              availableLanguages,
            })
          }
        : undefined
    navigation.setOptions({
      header: () => (
        <Header
          route={route}
          navigation={navigation}
          categoriesAvailable
          routeCityModel={city}
          goToLanguageChange={goToLanguageChange}
        />
      ),
    })
  }, [route, navigation, city, languageCode, availableLanguages, languages])
}

export default useHeader
