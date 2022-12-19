import React, { ReactElement } from 'react'

import { ErrorCode, OFFERS_ROUTE, SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadSprungbrettJobs from '../hooks/useLoadSprungbrettJobs'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import SprungbrettOffer from './SprungbrettOffer'

type SprungbrettOfferContainerProps = {
  route: RouteProps<SprungbrettOfferRouteType>
  navigation: NavigationProps<SprungbrettOfferRouteType>
}

const SprungbrettOfferContainer = ({ route, navigation }: SprungbrettOfferContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const { data, ...response } = useLoadSprungbrettJobs({ cityCode, languageCode })
  const error = data?.city && !data.city.offersEnabled ? ErrorCode.PageNotFound : response.error

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: OFFERS_ROUTE,
      cityCode,
      slug: SPRUNGBRETT_OFFER_ROUTE,
      language: languageCode,
      isPositiveFeedback,
    })
  }

  return (
    <LoadingErrorHandler {...response} error={error}>
      {data && (
        <SprungbrettOffer
          title={data.extra.sprungbrettOffer.title}
          jobs={data.extra.sprungbrettJobs}
          language={languageCode}
          navigateToFeedback={navigateToFeedback}
          refresh={response.refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SprungbrettOfferContainer
