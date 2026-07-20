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
      <Trans i18nKey='layout:languageNotAvailableMessage'>
        This gets replaced
        {canGiveFeedback ? <Link onPress={navigateToFeedback}>by react-i18next</Link> : <Text>by react-i18next</Text>}
      </Trans>
    </Text>
  )
}

export default LanguageNotAvailableMessage
