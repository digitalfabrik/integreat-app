import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { RefreshControl } from 'react-native'
import { TFunction, withTranslation } from 'react-i18next'
import SprungbrettOffer from '../components/SprungbrettOffer'
import {
  CityModel,
  createOffersEndpoint,
  createSprungbrettJobsEndpoint,
  NotFoundError,
  OFFERS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel
} from 'api-client'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { ThemeType } from 'build-configs/ThemeType'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { fromError } from '../../../modules/error/ErrorCodes'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import { SprungbrettOfferRouteType } from 'api-client/src/routes'
import { useLoadFromEndpoint } from '../../../modules/endpoint/hooks/useLoadFromEndpoint'
import { StateType } from '../../../modules/app/StateType'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
type OwnPropsType = {
  route: RoutePropType<SprungbrettOfferRouteType>
  navigation: NavigationPropType<SprungbrettOfferRouteType>
}
type SprungbrettPropsType = OwnPropsType & {
  theme: ThemeType
  t: TFunction
}

const SprungbrettOfferContainer = ({ route, navigation, theme, t }: SprungbrettPropsType) => {
  const cities = useSelector<StateType, Readonly<Array<CityModel>> | null>((state: StateType) =>
    state.cities.status === 'ready' ? state.cities.models : null
  )
  const [title, setTitle] = useState<string>('')
  const { cityCode, languageCode } = route.params
  const alias = SPRUNGBRETT_OFFER_ROUTE
  const requestJobs = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    const offersPayload = await createOffersEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode
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
        language: languageCode
      })
    }

    setTitle(sprungbrettOffer.title)
    return createSprungbrettJobsEndpoint(sprungbrettOffer.path).request(undefined)
  }, [cityCode, languageCode, alias, setTitle])
  const { data: jobs, error: jobsError, loading, refresh } = useLoadFromEndpoint<Array<SprungbrettJobModel>>(
    requestJobs
  )

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: OFFERS_ROUTE,
      cityCode,
      alias,
      language: languageCode,
      isPositiveFeedback
    })
  }

  const cityModel = cities && cities.find(city => city.code === cityCode)

  if (jobsError || (cityModel && !cityModel.offersEnabled)) {
    const error =
      jobsError ||
      new NotFoundError({
        type: 'category',
        id: 'offers',
        city: cityCode,
        language: languageCode
      })
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}>
        <FailureContainer code={fromError(error)} tryAgain={refresh} />
      </LayoutedScrollView>
    )
  }

  return (
    <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}>
      {jobs && (
        <SprungbrettOffer
          title={title}
          jobs={jobs}
          t={t}
          theme={theme}
          language={languageCode}
          navigateToFeedback={navigateToFeedback}
        />
      )}
    </LayoutedScrollView>
  )
}

export default withTranslation('sprungbrett')(withTheme<SprungbrettPropsType>(SprungbrettOfferContainer))
