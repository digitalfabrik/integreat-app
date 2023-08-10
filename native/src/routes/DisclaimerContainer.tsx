import React, { ReactElement } from 'react'

import { createDisclaimerEndpoint, DISCLAIMER_ROUTE, DisclaimerRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import urlFromRouteInformation from '../navigation/url'
import Disclaimer from './Disclaimer'
import LoadingErrorHandler from './LoadingErrorHandler'

type DisclaimerContainerProps = {
  route: RouteProps<DisclaimerRouteType>
  navigation: NavigationProps<DisclaimerRouteType>
}

const DisclaimerContainer = ({ navigation, route }: DisclaimerContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const { data, ...response } = useLoadExtraCityContent({
    createEndpoint: createDisclaimerEndpoint,
    cityCode,
    languageCode,
  })

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: DISCLAIMER_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  return (
    <LoadingErrorHandler {...response} scrollView>
      {data && <Disclaimer disclaimer={data.extra} language={languageCode} />}
    </LoadingErrorHandler>
  )
}

export default DisclaimerContainer
