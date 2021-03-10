// @flow

import React, { useState, useCallback, useEffect } from 'react'
import { RefreshControl } from 'react-native'
import { type TFunction, withTranslation } from 'react-i18next'
import SprungbrettOffer from '../components/SprungbrettOffer'
import { createSprungbrettJobsEndpoint, SprungbrettJobModel } from 'api-client'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from 'build-configs/ThemeType'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { fromError } from '../../../modules/error/ErrorCodes'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import type { SprungbrettOfferRouteType } from 'api-client/src/routes'
import loadFromEndpoint from '../../../modules/endpoint/loadFromEndpoint'

type OwnPropsType = {|
  route: RoutePropType<SprungbrettOfferRouteType>,
  navigation: NavigationPropType<SprungbrettOfferRouteType>
|}

type SprungbrettPropsType = {|
  ...OwnPropsType,
  theme: ThemeType,
  t: TFunction
|}

const SprungbrettOfferContainer = ({ route, navigation, theme, t }: SprungbrettPropsType) => {
  const [jobs, setJobs] = useState<?Array<SprungbrettJobModel>>(null)
  const [error, setError] = useState<?Error>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { cityCode, languageCode, title, alias, apiUrl } = route.params

  const navigateToFeedback = useCallback((isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      type: 'Offers',
      cityCode,
      title,
      alias,
      language: languageCode,
      isPositiveFeedback
    })
  }, [cityCode, languageCode, title, alias, navigation])

  const loadJobs = useCallback(async () => {
    const request = async () =>
      await createSprungbrettJobsEndpoint(apiUrl).request()

    await loadFromEndpoint<Array<SprungbrettJobModel>>(request, setJobs, setError, setLoading)
  }, [apiUrl, setJobs, setError, setLoading])

  const tryAgain = useCallback(() => { loadJobs().catch(e => setError(e)) }, [loadJobs])

  useEffect(() => {
    loadJobs().catch(e => setError(e))
  }, [loadJobs])

  if (error) {
    return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadJobs} refreshing={loading} />}>
          <FailureContainer code={fromError(error)} tryAgain={tryAgain} />
        </LayoutedScrollView>
    )
  }

  return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadJobs} refreshing={loading} />}>
    {jobs && <SprungbrettOffer title={title}
                               jobs={jobs}
                               t={t}
                               theme={theme}
                               language={languageCode}
                               navigateToFeedback={navigateToFeedback} />}
    </LayoutedScrollView>
}

export default withTranslation<$Diff<SprungbrettPropsType, {| theme: ThemeType |}>>('sprungbrett')(
  withTheme<SprungbrettPropsType>(SprungbrettOfferContainer)
)
