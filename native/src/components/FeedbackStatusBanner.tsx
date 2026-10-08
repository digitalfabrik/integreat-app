import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Icon, IconButton } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Text from '../components/base/Text'
import Link from './Link'

const Banner = styled.View<{ $successful: boolean }>`
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.$successful ? props.theme.colors.success.light : props.theme.colors.error)};
  border-radius: 8px;
  padding: 32px;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 4px;
`

const Content = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
`

const TextWrapper = styled.View`
  gap: 2px;
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
  const theme = useTheme()

  const titleText = successful ? t($ => $.feedback.thanks.title) : t($ => $.error.title)
  const descriptionText = successful ? t($ => $.feedback.thanks.description) : t($ => $.error.unknownError)

  const bannerLabel = `${titleText}. ${descriptionText}`

  return (
    <Banner
      $successful={successful}
      accessible
      role='alert'
      accessibilityLabel={bannerLabel}
      accessibilityLiveRegion='assertive'>
      <CloseButton icon='close' onPress={onClose} accessibilityLabel={t($ => $.common.actions.close)} />
      <Content>
        <View>
          <Icon
            source={successful ? 'check-circle' : 'alert-circle'}
            size={32}
            color={successful ? theme.colors.success.main : theme.colors.error}
          />
        </View>
        <TextWrapper>
          <Text variant='subtitle1'>{titleText}</Text>
          <Text variant='body2'>{descriptionText}</Text>
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
      </Content>
    </Banner>
  )
}

export default FeedbackStatusBanner
