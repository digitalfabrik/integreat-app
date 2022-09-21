import React, { ReactElement, useCallback, useState } from 'react'
import { RefreshControl } from 'react-native'

import {
  createOffersEndpoint,
  createSprungbrettJobsEndpoint,
  fromError,
  NotFoundError,
  OFFERS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  SprungbrettOfferRouteType,
  useLoadFromEndpoint,
} from 'api-client'

import Failure from '../components/Failure'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useCities from '../hooks/useCities'
import useReportError from '../hooks/useReportError'
import useSetShareUrl from '../hooks/useSetShareUrl'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { determineApiUrl } from '../utils/helpers'
import SprungbrettOffer from './SprungbrettOffer'

type Props = {
  route: RoutePropType<SprungbrettOfferRouteType>
  navigation: NavigationPropType<SprungbrettOfferRouteType>
}

const SprungbrettOfferContainer = ({ route, navigation }: Props): ReactElement => {
  const cities = useCities()
  const [title, setTitle] = useState<string>('')
  const { cityCode, languageCode } = route.params
  const alias = SPRUNGBRETT_OFFER_ROUTE

  const routeInformation = { route: SPRUNGBRETT_OFFER_ROUTE, languageCode, cityCode }
  useSetShareUrl({ navigation, routeInformation, route })

  const requestJobs = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    const offersPayload = await createOffersEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode,
    })

    if (offersPayload.error) {
      throw offersPayload.error
    } else if (!offersPayload.data) {
      throw new Error('Offers not available!')
    }

    const sprungbrettOffer = offersPayload.data.find(offer => offer.alias === alias)

    if (!sprungbrettOffer) {
      throw new NotFoundError({
        type: 'offer',
        id: alias,
        city: cityCode,
        language: languageCode,
      })
    }

    setTitle(sprungbrettOffer.title)
    return createSprungbrettJobsEndpoint(sprungbrettOffer.path).request(undefined)
  }, [cityCode, languageCode, alias, setTitle])
  const {
    data: jobs,
    error: jobsError,
    loading,
    refresh,
  } = useLoadFromEndpoint<Array<SprungbrettJobModel>>(requestJobs)
  useReportError(jobsError)

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: OFFERS_ROUTE,
      cityCode,
      alias,
      language: languageCode,
      isPositiveFeedback,
    })
  }

  const cityModel = cities && cities.find(city => city.code === cityCode)

  const refreshControl = <RefreshControl onRefresh={refresh} refreshing={loading} />

  if (jobsError || (cityModel && !cityModel.offersEnabled)) {
    const error =
      jobsError ||
      new NotFoundError({
        type: 'category',
        id: 'offers',
        city: cityCode,
        language: languageCode,
      })
    return (
      <LayoutedScrollView refreshControl={refreshControl}>
        <Failure code={fromError(error)} tryAgain={refresh} />
      </LayoutedScrollView>
    )
  }

  if (!jobs) {
    return <LayoutedScrollView refreshControl={refreshControl} />
  }

  return (
    <Layout>
      <SprungbrettOffer
        title={title}
        jobs={jobs}
        language={languageCode}
        navigateToFeedback={navigateToFeedback}
        refresh={refresh}
      />
    </Layout>
  )
}

export default SprungbrettOfferContainer
