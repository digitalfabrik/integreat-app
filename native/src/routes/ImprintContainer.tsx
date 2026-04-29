import React, { ReactElement } from 'react'

import { IMPRINT_ROUTE, ImprintRouteType } from 'shared'
import { createImprintEndpoint } from 'shared/api'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadExtraRegionContent from '../hooks/useLoadExtraRegionContent'
import useRegionAppContext from '../hooks/useRegionAppContext'
import urlFromRouteInformation from '../utils/url'
import Imprint from './Imprint'
import LoadingErrorHandler from './LoadingErrorHandler'

type ImprintContainerProps = {
  route: RouteProps<ImprintRouteType>
  navigation: NavigationProps<ImprintRouteType>
}

const ImprintContainer = ({ navigation, route }: ImprintContainerProps): ReactElement => {
  const { regionCode, languageCode } = useRegionAppContext()
  const { data, ...response } = useLoadExtraRegionContent({
    createEndpoint: createImprintEndpoint,
    regionCode,
    languageCode,
  })

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: IMPRINT_ROUTE, languageCode, regionCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  return (
    <LoadingErrorHandler {...response} scrollView>
      {data && <Imprint imprint={data.extra} language={languageCode} />}
    </LoadingErrorHandler>
  )
}

export default ImprintContainer
