import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View, AccessibilityRole } from 'react-native'
import { Badge, Icon } from 'react-native-elements'
import styled from 'styled-components/native'

import SettingsSwitch from './SettingsSwitch'
import Touchable from './Touchable'

const PadView = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
  padding-vertical: 8px;
`
const RightContentContainer = styled.View`
  flex: 0.4;
  justify-content: center;
  align-items: flex-end;
  padding: 0 5px;
`
const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`
const Title = styled.Text<{ bigTitle: boolean }>`
  color: ${props => props.theme.colors.textColor};
  ${props => (props.bigTitle ? 'font-size: 18px;' : '')}
`
const Description = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
`

type PropType = {
  title: string
  description?: string
  onPress: () => void
  bigTitle?: boolean
  accessibilityRole?: AccessibilityRole
  hasSwitch?: boolean
  hasBadge?: boolean
  value: boolean
}

const SettingItem = (props: PropType): ReactElement => {
  const { title, description, onPress, value, hasBadge, hasSwitch, bigTitle, accessibilityRole } = props
  const { t } = useTranslation('settings')
  return (
    <Touchable onPress={onPress} accessibilityRole={accessibilityRole}>
      <PadView>
        <ContentContainer>
          <View>
            <Title bigTitle={bigTitle || false}>{title}</Title>
          </View>
          {description && (
            <View>
              <Description>{description}</Description>
            </View>
          )}
        </ContentContainer>
        <RightContentContainer>
          {hasSwitch && <SettingsSwitch value={value} onPress={onPress} />}
          {hasBadge && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Badge status={value ? 'success' : 'error'} />
              <Text> {value ? t('enabled') : t('disabled')}</Text>
              <Icon name='chevron-right' />
            </View>
          )}
        </RightContentContainer>
      </PadView>
    </Touchable>
  )
}

export default SettingItem
