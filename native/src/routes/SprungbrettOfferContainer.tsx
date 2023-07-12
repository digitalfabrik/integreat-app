import React, { ReactElement, useCallback } from 'react'

import { ErrorCode, loadSprungbrettJobs, SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import urlFromRouteInformation from '../navigation/url'
import { determineApiUrl } from '../utils/helpers'
import LoadingErrorHandler from './LoadingErrorHandler'
import SprungbrettOffer from './SprungbrettOffer'

type SprungbrettOfferContainerProps = {
  route: RouteProps<SprungbrettOfferRouteType>
  navigation: NavigationProps<SprungbrettOfferRouteType>
}

const SprungbrettOfferContainer = ({ route, navigation }: SprungbrettOfferContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const load = useCallback(
    () => loadSprungbrettJobs({ cityCode, languageCode, baseUrl: determineApiUrl }),
    [cityCode, languageCode]
  )
  const { data, ...response } = useLoadExtraCityContent({ cityCode, languageCode, load })
  const error = data?.city && !data.city.offersEnabled ? ErrorCode.PageNotFound : response.error

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  return (
    <LoadingErrorHandler {...response} error={error}>
      {data && (
        <SprungbrettOffer
          title={data.extra.sprungbrettOffer.title}
          jobs={data.extra.sprungbrettJobs}
          language={languageCode}
          refresh={response.refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SprungbrettOfferContainer
