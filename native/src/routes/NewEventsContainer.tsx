import React, { ReactElement, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { EVENTS_ROUTE, EventsRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { LOADING_TIMEOUT } from '../hocs/withPayloadProvider'
import useLoadEvents from '../hooks/useLoadEvents'
import useSetShareUrl from '../hooks/useSetShareUrl'
import useOnLanguageChange from '../hooks/useUpdateParamsOnLanguageChange'
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

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (slug) {
  //       navigation.setParams({ languageCode: 'de' })
  //     }
  //   }, LOADING_TIMEOUT)
  //   return () => clearTimeout(timer)
  // }, [navigation, slug])

  const currentEvent = slug ? data?.events.find(it => it.slug === slug) : undefined

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentEvent) {
        const newSlug = currentEvent.availableLanguageSlugs[newLanguage]
        // TODO: Handle language not available?
        navigation.setParams({ slug: newSlug })
      }
    },
    [currentEvent, navigation]
  )
  useOnLanguageChange({ languageCode, onLanguageChange })

  const routeInformation = {
    route: EVENTS_ROUTE,
    languageCode,
    cityCode,
    slug,
  }
  useSetShareUrl({ navigation, routeInformation, route })

  // TODO
  const resourceCacheUrl = ''

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
          navigateTo={createNavigate(dispatch, navigation)}
          navigateToFeedback={createNavigateToFeedbackModal(navigation)}
          refresh={refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default NewEventsContainer
