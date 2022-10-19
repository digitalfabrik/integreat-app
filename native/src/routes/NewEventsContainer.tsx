import React, { ReactElement, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { EVENTS_ROUTE, EventsRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useLoadEvents from '../hooks/useLoadEvents'
import useSetShareUrl from '../hooks/useSetShareUrl'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import Events from './Events'
import LoadingErrorHandler from './LoadingErrorHandler'

type NewEventsContainerProps = {
  route: RoutePropType<EventsRouteType>
  navigation: NavigationPropType<EventsRouteType>
}

const NewEventsContainer = ({ navigation, route }: NewEventsContainerProps): ReactElement => {
  const { cityCode, languageCode, slug } = route.params
  const dispatch = useDispatch()

  const response = useLoadEvents({ cityCode, languageCode })
  const { data, refresh } = response

  const currentEvent = slug ? data?.events.find(it => it.path === slug) : undefined
  useEffect(() => {
    const newSlug = currentEvent?.availableLanguages.get(languageCode)
    navigation.setParams({ slug: newSlug })
  }, [languageCode, currentEvent, navigation])

  const routeInformation = {
    route: EVENTS_ROUTE,
    languageCode,
    cityCode,
    // TODO
    cityContentPath: undefined,
  }
  useSetShareUrl({ navigation, routeInformation, route })

  // TODO
  const path = ''
  const resourceCacheUrl = ''

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Events
          path={path}
          events={data.events}
          cityModel={data.city}
          language={languageCode}
          resourceCache={data.resourceCache}
          resourceCacheUrl={resourceCacheUrl}
          navigateTo={createNavigate(dispatch, navigation)}
          navigateToFeedback={createNavigateToFeedbackModal(navigation)}
          refresh={refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default NewEventsContainer
