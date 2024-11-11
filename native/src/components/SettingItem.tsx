import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View, Role } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './base/Pressable'
import SettingsSwitch from './base/SettingsSwitch'

const PadView = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
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

const FlexEndContainer = styled.View`
  flex: 0.4;
  justify-content: center;
  align-items: flex-end;
  padding: 0 5px;
`

const Badge = styled.View<{ enabled: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => (props.enabled ? 'limegreen' : 'red')};
`

type SettingItemProps = {
  title: string
  description?: string
  onPress: () => Promise<void>
  bigTitle?: boolean
  role?: Role
  hasSwitch?: boolean
  hasBadge?: boolean
  value: boolean
}

const SettingItem = (props: SettingItemProps): ReactElement => {
  const { title, description, onPress, value, hasBadge, hasSwitch, bigTitle, role } = props
  const { t } = useTranslation('settings')

  return (
    <Pressable onPress={onPress} role={role ?? 'none'} accessible={false}>
      <PadView>
        <ContentContainer>
          <View>
            <Title bigTitle={bigTitle || false}>{title}</Title>
          </View>
          {!!description && (
            <View>
              <Description>{description}</Description>
            </View>
          )}
        </ContentContainer>
        <FlexEndContainer>
          {hasSwitch && <SettingsSwitch value={value} onPress={onPress} />}
          {hasBadge && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Badge enabled={value} />
              <Text> {value ? t('enabled') : t('disabled')}</Text>
            </View>
          )}
        </FlexEndContainer>
      </PadView>
    </Pressable>
  )
}

export default SettingItem
