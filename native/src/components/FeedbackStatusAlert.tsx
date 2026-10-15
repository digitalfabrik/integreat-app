import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, IconButton } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Text from '../components/base/Text'

const Alert = styled.View<{ $successful: boolean }>`
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.$successful ? props.theme.colors.successContainer : props.theme.colors.errorContainer)};
  border-radius: 8px;
  padding: 16px;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 4px;
`

const Content = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin: 16px 0;
  gap: 8px;
`

const TextWrapper = styled.View`
  flex: 1;
  gap: 4px;
`

const StyledText = styled(Text)<{ $successful: boolean }>`
  color: ${props => (props.$successful ? props.theme.colors.onSuccessContainer : props.theme.colors.onErrorContainer)};
`

type FeedbackStatusAlertProps = {
  severity: 'success' | 'error'
  title: string
  description: string
  onClose: () => void
  actions?: ReactNode
}

const FeedbackStatusAlert = ({
  severity,
  title,
  description,
  onClose,
  actions,
}: FeedbackStatusAlertProps): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()
  const successful = severity === 'success'

  return (
    <Alert $successful={successful} accessible role='alert' accessibilityLiveRegion='assertive'>
      <CloseButton
        icon='close'
        iconColor={successful ? theme.colors.onSuccessContainer : theme.colors.onErrorContainer}
        onPress={onClose}
        accessibilityLabel={t($ => $.common.actions.close)}
      />
      <Content>
        <Icon
          source={successful ? 'check-circle' : 'alert-circle'}
          size={32}
          color={successful ? theme.colors.success : theme.colors.error}
        />
        <TextWrapper>
          <StyledText $successful={successful} variant='subtitle1'>
            {title}
          </StyledText>
          <StyledText $successful={successful} variant='body2'>
            {description}
          </StyledText>
          {actions}
        </TextWrapper>
      </Content>
    </Alert>
  )
}

export default FeedbackStatusAlert
