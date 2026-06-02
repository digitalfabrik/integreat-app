import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { ParamListBase } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect } from 'react'

import { PLACES_ROUTE, PlacesRouteType } from 'shared'

import { TAB_NAVIGATOR_ID } from '../constants'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useLocalStackHistory from '../hooks/useLocalStackHistory'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import urlFromRouteInformation from '../utils/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import Places from './Places'

const resetHistory = {
  slug: undefined,
  multipoi: undefined,
  placeCategoryId: undefined,
  currentlyOpen: false,
  showFilterSelection: false,
}

type PlacesContainerProps = {
  route: RouteProps<PlacesRouteType>
  navigation: NavigationProps<PlacesRouteType>
}

const PlacesContainer = ({ navigation, route }: PlacesContainerProps): ReactElement => {
  const { regionCode, languageCode } = useRegionAppContext()
  const { data, ...response } = useLoadRegionContent({ regionCode, languageCode })

  // We want to use a custom local history implementation to keep a history while avoiding rerenders
  // Stack history would require rerendering the map and bottom sheet on every place (un-)selection
  const localHistory = useLocalStackHistory({
    params: route.params,
    historyFromParams: ({ slug, multipoi, placeCategoryId }) => [
      { slug, multipoi, placeCategoryId, currentlyOpen: false, showFilterSelection: false },
    ],
    resetHistory,
  })
  const { slug, multipoi, placeCategoryId } = localHistory.current

  useEffect(
    () =>
      navigation
        .getParent<BottomTabNavigationProp<ParamListBase>>(TAB_NAVIGATOR_ID)
        // Reset the history when we press the places tab while already focused
        // Keep the history while just switching between tabs
        .addListener('tabPress', () => (navigation.isFocused() ? localHistory.reset() : null)),
    [navigation, localHistory],
  )

  const currentPlace = slug ? data?.places.find(it => it.slug === slug) : undefined
  const availableLanguages = currentPlace
    ? Object.keys(currentPlace.availableLanguageSlugs)
    : data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: PLACES_ROUTE,
    languageCode,
    regionCode,
    slug,
    multipoi,
    placeCategoryId,
    zoom: route.params.zoom,
  })

  const goBack =
    localHistory.history.length > 1
      ? localHistory.pop
      : () => {
          // Reset the local places history on back navigation to start with the places list next time
          localHistory.reset()
          navigation.goBack()
        }

  useHeader({ navigation, route, availableLanguages, data, shareUrl, goBack })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      localHistory.reset(
        localHistory.history.map(history => {
          const place = history.slug ? data?.places.find(it => it.slug === history.slug) : undefined
          const newSlug = place?.availableLanguageSlugs[newLanguage]
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
        <Places
          refresh={response.refresh}
          localHistory={localHistory}
          places={data.places}
          regionModel={data.region}
          initialZoom={route.params.zoom}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default PlacesContainer
