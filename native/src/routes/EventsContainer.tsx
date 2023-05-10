import React, { ReactElement, useCallback } from 'react'

import { EVENTS_ROUTE, EventsRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useNavigate from '../hooks/useNavigate'
import usePreviousProp from '../hooks/usePreviousProp'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import Events from './Events'
import LoadingErrorHandler from './LoadingErrorHandler'

type EventsContainerProps = {
  route: RouteProps<EventsRouteType>
  navigation: NavigationProps<EventsRouteType>
}

const EventsContainer = ({ navigation, route }: EventsContainerProps): ReactElement => {
  const { slug } = route.params
  const { cityCode, languageCode } = useCityAppContext()
  const { navigateTo } = useNavigate()

  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })

  const currentEvent = slug ? data?.events.find(it => it.slug === slug) : undefined
  const availableLanguages = currentEvent
    ? Object.keys(currentEvent.availableLanguageSlugs)
    : data?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: EVENTS_ROUTE,
    languageCode,
    cityCode,
    slug,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })
  useSetRouteTitle({ navigation, title: currentEvent?.title })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentEvent) {
        const newSlug = currentEvent.availableLanguageSlugs[newLanguage]
        navigation.setParams({ slug: newSlug })
      }
    },
    [currentEvent, navigation]
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Events
          slug={slug}
          events={data.events}
          cityModel={data.city}
          language={languageCode}
          navigateTo={navigateTo}
          navigateToFeedback={createNavigateToFeedbackModal(navigation)}
          refresh={response.refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default EventsContainer
