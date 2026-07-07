import React, { ReactElement, useContext } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components/native'

import { FEEDBACK_MODAL_ROUTE, LanguagesRouteType } from 'shared'
import { FeedbackRouteType } from 'shared/api'

import { NavigationProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContext'
import Text from './base/Text'

const FeedbackLink = styled(Text)`
  color: ${props => props.theme.colors.primary};
  text-decoration-line: underline;
`

type LanguageNotAvailableMessageProps = {
  navigation: NavigationProps<LanguagesRouteType>
  previousRouteType?: FeedbackRouteType
  slug?: string
  close: () => void
}

const LanguageNotAvailableMessage = ({
  navigation,
  previousRouteType,
  slug,
  close,
}: LanguageNotAvailableMessageProps): ReactElement => {
  const { languageCode, regionCode } = useContext(AppContext)
  const canGiveFeedback = !!regionCode && !!previousRouteType

  const navigateToFeedback = () => {
    if (regionCode && previousRouteType) {
      close()
      navigation.navigate(FEEDBACK_MODAL_ROUTE, {
        routeType: previousRouteType,
        language: languageCode,
        regionCode,
        slug,
      })
    }
  }

  return (
    <Text>
      <Trans i18nKey='layout:languageNotAvailableMessage'>
        This gets replaced
        {canGiveFeedback ? (
          <FeedbackLink onPress={navigateToFeedback} role='link'>
            by react-i18next
          </FeedbackLink>
        ) : (
          <Text>by react-i18next</Text>
        )}
      </Trans>
    </Text>
  )
}

export default LanguageNotAvailableMessage
