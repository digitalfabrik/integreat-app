import React, { ReactElement, useContext } from 'react'

import { createDisclaimerEndpoint, DISCLAIMER_ROUTE, DisclaimerRouteType } from 'api-client'

import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import Disclaimer from './Disclaimer'
import LoadingErrorHandler from './LoadingErrorHandler'

type DisclaimerContainerProps = {
  route: RouteProps<DisclaimerRouteType>
  navigation: NavigationProps<DisclaimerRouteType>
}

const DisclaimerContainer = ({ navigation, route }: DisclaimerContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const resourceCacheUrl = useContext(StaticServerContext)
  const { data, ...response } = useLoadExtraCityContent({
    createEndpoint: createDisclaimerEndpoint,
    cityCode,
    languageCode,
  })

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: DISCLAIMER_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: DISCLAIMER_ROUTE,
      cityCode,
      language: languageCode,
      isPositiveFeedback,
      slug: data?.extra.slug,
    })
  }

  return (
    <LoadingErrorHandler {...response} scrollView>
      {data && (
        <>
          <Disclaimer resourceCacheUrl={resourceCacheUrl} disclaimer={data.extra} language={languageCode} />
          <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default DisclaimerContainer
