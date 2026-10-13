import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { EVENTS_ROUTE, EventsRouteType } from 'shared'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useNavigate from '../hooks/useNavigate'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
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
  const { t } = useTranslation()

  const { data, ...response } = useLoadRegionContent({ regionCode, languageCode })

  const currentEvent = slug ? data?.events?.find(it => it.slug === slug) : undefined
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
  useSetRouteTitle(currentEvent?.title ?? t($ => $.events.title))

  // The content of the old language is already gone in the render the language changes in
  const previousEvent = usePreviousProp({ prop: currentEvent })
  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (previousEvent) {
        const newSlug = previousEvent.availableLanguageSlugs[newLanguage]
        navigation.setParams({ slug: newSlug })
      }
    },
    [previousEvent, navigation],
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <LoadingErrorHandler {...response}>
      {data?.events && (
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
