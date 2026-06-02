import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { ParamListBase } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect } from 'react'

import { POIS_ROUTE, PoisRouteType } from 'shared'

import { TAB_NAVIGATOR_ID } from '../constants'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useLocalStackHistory from '../hooks/useLocalStackHistory'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import urlFromRouteInformation from '../utils/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import Pois from './Places'

const resetHistory = {
  slug: undefined,
  multipoi: undefined,
  poiCategoryId: undefined,
  currentlyOpen: false,
  showFilterSelection: false,
}

type PoisContainerProps = {
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const PoisContainer = ({ navigation, route }: PoisContainerProps): ReactElement => {
  const { regionCode, languageCode } = useRegionAppContext()
  const { data, ...response } = useLoadRegionContent({ regionCode, languageCode })

  // We want to use a custom local history implementation to keep a history while avoiding rerenders
  // Stack history would require rerendering the map and bottom sheet on every poi (un-)selection
  const localHistory = useLocalStackHistory({
    params: route.params,
    historyFromParams: ({ slug, multipoi, poiCategoryId }) => [
      { slug, multipoi, poiCategoryId, currentlyOpen: false, showFilterSelection: false },
    ],
    resetHistory,
  })
  const { slug, multipoi, poiCategoryId } = localHistory.current

  useEffect(
    () =>
      navigation
        .getParent<BottomTabNavigationProp<ParamListBase>>(TAB_NAVIGATOR_ID)
        // Reset the history when we press the pois tab while already focused
        // Keep the history while just switching between tabs
        .addListener('tabPress', () => (navigation.isFocused() ? localHistory.reset() : null)),
    [navigation, localHistory],
  )

  const currentPoi = slug ? data?.pois.find(it => it.slug === slug) : undefined
  const availableLanguages = currentPoi
    ? Object.keys(currentPoi.availableLanguageSlugs)
    : data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: POIS_ROUTE,
    languageCode,
    regionCode,
    slug,
    multipoi,
    poiCategoryId,
    zoom: route.params.zoom,
  })

  const goBack =
    localHistory.history.length > 1
      ? localHistory.pop
      : () => {
          // Reset the local pois history on back navigation to start with the pois list next time
          localHistory.reset()
          navigation.goBack()
        }

  useHeader({ navigation, route, availableLanguages, data, shareUrl, goBack })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      localHistory.reset(
        localHistory.history.map(history => {
          const poi = history.slug ? data?.pois.find(it => it.slug === history.slug) : undefined
          const newSlug = poi?.availableLanguageSlugs[newLanguage]
          return { ...history, slug: newSlug }
        }),
      )
    },
    [data, localHistory],
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Pois
          refresh={response.refresh}
          localHistory={localHistory}
          pois={data.pois}
          regionModel={data.region}
          initialZoom={route.params.zoom}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default PoisContainer
