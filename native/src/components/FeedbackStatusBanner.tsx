import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { IconButton } from 'react-native-paper'
import styled from 'styled-components/native'

import Text from '../components/base/Text'
import Link from './Link'

const Banner = styled.View`
  background-color: ${props => props.theme.colors.success.light};
  padding: 12px;
  border-radius: 8px;
  gap: 4px;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 4px;
`

const TextWrapper = styled.View`
  gap: 4px;
  padding: 16px;
`

type FeedbackStatusBannerProps = {
  successful: boolean
  onClose: () => void
  onNavigateToFeedback?: () => void
}

const FeedbackStatusBanner = ({
  successful,
  onClose,
  onNavigateToFeedback,
}: FeedbackStatusBannerProps): ReactElement => {
  const { t } = useTranslation()

  return (
    <Banner>
      <CloseButton icon='close' onPress={onClose} accessibilityLabel={t($ => $.common.actions.close)} />
      <TextWrapper>
        <Text variant='subtitle1'>{successful ? t($ => $.feedback.thanks.title) : t($ => $.error.title)}</Text>
        <Text variant='body2'>{successful ? t($ => $.feedback.thanks.description) : t($ => $.error.unknownError)}</Text>
        {successful && onNavigateToFeedback && (
          <Text variant='body2'>
            <Trans
              ns='feedback'
              i18nKey={$ => $.feedback.thanks.chatReferral}
              components={{
                Link: <Link onPress={onNavigateToFeedback}>{t($ => $.feedback.thanks.chatReferral)}</Link>,
              }}
            />
          </Text>
        )}
      </TextWrapper>
    </Banner>
  )
}

export default FeedbackStatusBanner
