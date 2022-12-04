import React, { ReactElement, useCallback } from 'react'

import { POIS_ROUTE, PoisRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadPois from '../hooks/useLoadPois'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import Pois from './Pois'

type PoisContainerProps = {
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const PoisContainer = ({ navigation, route }: PoisContainerProps): ReactElement => {
  const { slug } = route.params
  const { cityCode, languageCode } = useCityAppContext()

  const response = useLoadPois({ cityCode, languageCode })
  const { data } = response

  const currentPoi = slug ? data?.pois.find(it => it.slug === slug) : undefined
  const availableLanguages = currentPoi
    ? Object.keys(currentPoi.availableLanguageSlugs)
    : data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: POIS_ROUTE,
    languageCode,
    cityCode,
    slug,
  })

  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentPoi) {
        const newSlug = currentPoi.availableLanguageSlugs[newLanguage]
        // TODO IGAPP-636: Handle language not available?
        navigation.setParams({ slug: newSlug })
      }
    },
    [currentPoi, navigation]
  )
  useOnLanguageChange({ languageCode, onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Pois pois={data.pois} cityModel={data.city} language={languageCode} route={route} navigation={navigation} />
      )}
    </LoadingErrorHandler>
  )
}

export default PoisContainer
