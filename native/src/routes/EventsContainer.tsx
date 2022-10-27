import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { ErrorCode, EVENTS_ROUTE, EventsRouteType } from 'api-client'

import Header from '../components/Header'
import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadEvents from '../hooks/useLoadEvents'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
import useSetShareUrl from '../hooks/useSetShareUrl'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
import Events from './Events'
import LoadingErrorHandler from './LoadingErrorHandler'

type EventsContainerProps = {
  route: RouteProps<EventsRouteType>
  navigation: NavigationProps<EventsRouteType>
}

const EventsContainer = ({ navigation, route }: EventsContainerProps): ReactElement => {
  const { slug } = route.params
  const { cityCode, languageCode } = useCityAppContext()
  const dispatch = useDispatch()
  const resourceCacheUrl = useContext(StaticServerContext)

  const response = useLoadEvents({ cityCode, languageCode })
  const { data, refresh } = response

  const currentEvent = slug ? data?.events.find(it => it.slug === slug) : undefined
  const availableLanguages = currentEvent
    ? Object.keys(currentEvent.availableLanguageSlugs)
    : data?.languages.map(it => it.code)

  useEffect(() => {
    const goToLanguageChange =
      data && availableLanguages
        ? () => {
            navigateToLanguageChange({
              navigation,
              languageCode,
              languages: data.languages,
              cityCode,
              availableLanguages,
            })
          }
        : undefined
    navigation.setOptions({
      // Only run on use effect dependency changes which means it is re-rendered anyway since props change
      // eslint-disable-next-line react/no-unstable-nested-components
      header: () => (
        <Header
          route={route}
          navigation={navigation}
          peeking={false}
          categoriesAvailable
          language={languageCode}
          routeCityModel={data?.city}
          goToLanguageChange={goToLanguageChange}
        />
      ),
    })
  }, [route, navigation, cityCode, languageCode, data, availableLanguages])

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
  useSetShareUrl({
    navigation,
    route,
    routeInformation: {
      route: EVENTS_ROUTE,
      languageCode,
      cityCode,
      slug,
    },
  })

  if (response.errorCode === ErrorCode.LanguageUnavailable) {
    return <LanguageNotAvailablePage />
  }

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

export default EventsContainer
