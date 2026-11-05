import React, { ReactElement, useEffect } from 'react'

import Header from '../components/Header'
import { HeaderMenuItemConfig } from '../components/HeaderMenuItem'
import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import { RegionContentData } from './useLoadRegionContent'

type UseHeaderProps<T extends RoutesType> = {
  navigation: NavigationProps<T>
  route: RouteProps<T>
  data: RegionContentData | null
  availableLanguages?: string[]
  shareUrl?: string
  goBack?: () => void
  menu?: ReactElement
  additionalMenuItems?: HeaderMenuItemConfig[]
}

const useHeader = <T extends RoutesType>({
  navigation,
  route,
  availableLanguages,
  data,
  shareUrl,
  goBack,
  menu,
  additionalMenuItems,
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
          regionName={data?.region.name}
          goBack={goBack}
          menu={menu}
          additionalMenuItems={additionalMenuItems}
        />
      ),
    })
  }, [route, navigation, data, availableLanguages, shareUrl, goBack, menu, additionalMenuItems])
}

export default useHeader
