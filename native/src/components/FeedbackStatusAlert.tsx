import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, IconButton } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Text from '../components/base/Text'
import { AlertSeverity } from '../utils/colors'

const Alert = styled.View<{ $backgroundColor: string }>`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$backgroundColor};
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

const StyledText = styled(Text)<{ $color: string }>`
  color: ${props => props.$color};
`

// Same icons as the standard mui alerts
const icons: Record<AlertSeverity, string> = {
  success: 'check-circle-outline',
  info: 'information-outline',
  warning: 'alert-outline',
  error: 'alert-circle-outline',
}

type FeedbackStatusAlertProps = {
  severity: AlertSeverity
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
  const colors = theme.colors.alert[severity]

  return (
    <Alert $backgroundColor={colors.background} accessible role='alert' accessibilityLiveRegion='assertive'>
      <CloseButton
        icon='close'
        iconColor={colors.text}
        onPress={onClose}
        accessibilityLabel={t($ => $.common.actions.close)}
      />
      <Content>
        <Icon source={icons[severity]} size={32} color={colors.icon} />
        <TextWrapper>
          <StyledText $color={colors.text} variant='subtitle1'>
            {title}
          </StyledText>
          <StyledText $color={colors.text} variant='body2'>
            {description}
          </StyledText>
          {actions}
        </TextWrapper>
      </Content>
    </Alert>
  )
}

export default FeedbackStatusAlert
