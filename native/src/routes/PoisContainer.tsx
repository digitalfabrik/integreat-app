import React, { ReactElement, useCallback } from 'react'

import { ErrorCode, POIS_ROUTE, PoisRouteType } from 'api-client'

import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadPois from '../hooks/useLoadPois'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
import useSetShareUrl from '../hooks/useSetShareUrl'
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

  useHeader({ navigation, route, availableLanguages, data })

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
  useSetShareUrl({
    navigation,
    route,
    routeInformation: {
      route: POIS_ROUTE,
      languageCode,
      cityCode,
      slug,
    },
  })

  if (response.errorCode === ErrorCode.LanguageUnavailable) {
    return <LanguageNotAvailablePage />
  }

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Pois pois={data.pois} cityModel={data.city} language={languageCode} route={route} navigation={navigation} />
      )}
    </LoadingErrorHandler>
  )
}

export default PoisContainer
