import React, { ReactElement, useCallback, useContext } from 'react'

import { EVENTS_ROUTE, EventsRouteType } from 'api-client'

import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadEvents from '../hooks/useLoadEvents'
import useNavigate from '../hooks/useNavigate'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
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
  const resourceCacheUrl = useContext(StaticServerContext)

  const response = useLoadEvents({ cityCode, languageCode })
  const { data, refresh } = response

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

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentEvent) {
        const newSlug = currentEvent.availableLanguageSlugs[newLanguage]
        // TODO IGAPP-636: Handle language not available?
        navigation.setParams({ slug: newSlug })
      }
    },
    [currentEvent, navigation]
  )
  useOnLanguageChange({ languageCode, onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Events
          slug={slug}
          events={data.events}
          cityModel={data.city}
          language={languageCode}
          resourceCache={data.resourceCache}
          resourceCacheUrl={resourceCacheUrl}
          navigateTo={navigateTo}
          navigateToFeedback={createNavigateToFeedbackModal(navigation)}
          refresh={refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default EventsContainer
