import React, { ReactElement, useContext } from 'react'
import { Trans } from 'react-i18next'

import { FEEDBACK_MODAL_ROUTE, LanguagesRouteType } from 'shared'
import { FeedbackRouteType } from 'shared/api'

import { NavigationProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContext'
import Link from './Link'
import Text from './base/Text'

type LanguageNotAvailableMessageProps = {
  navigation: NavigationProps<LanguagesRouteType>
  routeType?: FeedbackRouteType
  slug?: string
  close: () => void
}

const LanguageNotAvailableMessage = ({
  navigation,
  routeType,
  slug,
  close,
}: LanguageNotAvailableMessageProps): ReactElement => {
  const { languageCode, regionCode } = useContext(AppContext)
  const canGiveFeedback = !!regionCode && !!routeType

  const navigateToFeedback = () => {
    if (regionCode && routeType) {
      close()
      navigation.navigate(FEEDBACK_MODAL_ROUTE, {
        routeType,
        language: languageCode,
        regionCode,
        slug,
        rating: 'negative',
      })
    }
  }

  return (
    <Text>
      <Trans
        ns='languages'
        i18nKey={$ => $.languages.error.notFound.description}
        components={{
          Link: canGiveFeedback ? <Link onPress={navigateToFeedback}>feedback</Link> : <Text>feedback</Text>,
        }}
      />
    </Text>
  )
}

export default LanguageNotAvailableMessage
