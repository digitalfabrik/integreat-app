import React, { ReactElement, useCallback } from 'react'

import { POIS_ROUTE, PoisRouteType } from 'shared'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadCityContent from '../hooks/useLoadCityContent'
import usePreviousProp from '../hooks/usePreviousProp'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import Pois from './Pois'

type PoisContainerProps = {
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const PoisContainer = ({ navigation, route }: PoisContainerProps): ReactElement => {
  const { slug, multipoi, poiCategoryId, zoom } = route.params
  const { cityCode, languageCode } = useCityAppContext()

  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })

  const currentPoi = slug ? data?.pois.find(it => it.slug === slug) : undefined
  const availableLanguages = currentPoi
    ? Object.keys(currentPoi.availableLanguageSlugs)
    : data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: POIS_ROUTE,
    languageCode,
    cityCode,
    slug,
    multipoi,
    poiCategoryId,
    zoom,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })
  useSetRouteTitle({ navigation, title: currentPoi?.title })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentPoi) {
        const newSlug = currentPoi.availableLanguageSlugs[newLanguage]
        navigation.setParams({ slug: newSlug })
      }
    },
    [currentPoi, navigation],
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Pois pois={data.pois} cityModel={data.city} language={languageCode} route={route} navigation={navigation} />
      )}
    </LoadingErrorHandler>
  )
}

export default PoisContainer
