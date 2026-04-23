import React, { ReactElement, useCallback } from 'react'

import { POIS_ROUTE, PoisRouteType } from 'shared'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import urlFromRouteInformation from '../utils/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import Pois from './Pois'

type PoisContainerProps = {
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const PoisContainer = ({ navigation, route }: PoisContainerProps): ReactElement => {
  const { slug, multipoi, poiCategoryId, zoom } = route.params
  const { regionCode, languageCode } = useRegionAppContext()

  const { data, ...response } = useLoadRegionContent({ regionCode, languageCode })

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
    zoom,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

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
      {data && <Pois pois={data.pois} regionModel={data.region} route={route} navigation={navigation} />}
    </LoadingErrorHandler>
  )
}

export default PoisContainer
