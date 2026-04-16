import React, { ReactElement } from 'react'

import { IMPRINT_ROUTE, ImprintRouteType } from 'shared'
import { createImprintEndpoint } from 'shared/api'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import urlFromRouteInformation from '../navigation/url'
import Imprint from './Imprint'
import LoadingErrorHandler from './LoadingErrorHandler'

type ImprintContainerProps = {
  route: RouteProps<ImprintRouteType>
  navigation: NavigationProps<ImprintRouteType>
}

const ImprintContainer = ({ navigation, route }: ImprintContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const { data, ...response } = useLoadExtraCityContent({
    createEndpoint: createImprintEndpoint,
    cityCode,
    languageCode,
  })

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: IMPRINT_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  return (
    <LoadingErrorHandler {...response} scrollView>
      {data && <Imprint imprint={data.extra} language={languageCode} />}
    </LoadingErrorHandler>
  )
}

export default ImprintContainer
