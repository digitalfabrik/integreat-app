import React, { ReactElement, useCallback, useContext } from 'react'

import {
  createDisclaimerEndpoint,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  PageModel,
  useLoadFromEndpoint,
  getSlug,
} from 'api-client'

import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useReportError from '../hooks/useReportError'
import useSetShareUrl from '../hooks/useSetShareUrl'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { determineApiUrl } from '../utils/helpers'
import Disclaimer from './Disclaimer'
import LoadingErrorHandler from './LoadingErrorHandler'

type DisclaimerContainerProps = {
  route: RouteProps<DisclaimerRouteType>
  navigation: NavigationProps<DisclaimerRouteType>
}

const DisclaimerContainer = ({ navigation, route }: DisclaimerContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const resourceCacheUrl = useContext(StaticServerContext)

  const routeInformation = { route: DISCLAIMER_ROUTE, languageCode, cityCode }
  useSetShareUrl({ navigation, routeInformation, route })

  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return createDisclaimerEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode,
    })
  }, [cityCode, languageCode])
  const { data: disclaimer, ...response } = useLoadFromEndpoint<PageModel>(request)
  useReportError(response.error)

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: DISCLAIMER_ROUTE,
      cityCode,
      language: languageCode,
      isPositiveFeedback,
      slug: disclaimer ? getSlug(disclaimer.path) : undefined,
    })
  }

  return (
    <LoadingErrorHandler {...response} scrollView>
      {disclaimer && (
        <>
          <Disclaimer resourceCacheUrl={resourceCacheUrl} disclaimer={disclaimer} language={languageCode} />
          <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default DisclaimerContainer
