import React, { ReactElement, useCallback } from 'react'

import { EVENTS_ROUTE, EventsRouteType } from 'shared'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useNavigate from '../hooks/useNavigate'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import urlFromRouteInformation from '../utils/url'
import Events from './Events'
import LoadingErrorHandler from './LoadingErrorHandler'

type EventsContainerProps = {
  route: RouteProps<EventsRouteType>
  navigation: NavigationProps<EventsRouteType>
}

const EventsContainer = ({ navigation, route }: EventsContainerProps): ReactElement => {
  const { slug } = route.params
  const { regionCode, languageCode } = useRegionAppContext()
  const { navigateTo } = useNavigate()

  const { data, ...response } = useLoadRegionContent({ regionCode, languageCode })

  const currentEvent = slug ? data?.events.find(it => it.slug === slug) : undefined
  const availableLanguages = currentEvent
    ? Object.keys(currentEvent.availableLanguageSlugs)
    : data?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: EVENTS_ROUTE,
    languageCode,
    regionCode,
    slug,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentEvent) {
        const newSlug = currentEvent.availableLanguageSlugs[newLanguage]
        navigation.setParams({ slug: newSlug })
      }
    },
    [currentEvent, navigation],
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Events
          slug={slug}
          events={data.events}
          regionModel={data.region}
          language={languageCode}
          navigateTo={navigateTo}
          refresh={response.refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default EventsContainer
