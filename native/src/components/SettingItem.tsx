import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Role, StyleSheet } from 'react-native'
import { Switch, TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Text from './base/Text'

const TITLE_FONT_SIZE_REGULAR = 14
const TITLE_FONT_SIZE_BIG = 16

const PadView = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
`

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`

const FlexEndContainer = styled.View`
  flex: 0.4;
  justify-content: center;
  align-items: flex-end;
  padding: 0 5px;
`

const BadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Badge = styled.View<{ enabled: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => (props.enabled ? 'limegreen' : 'red')};
`

type SettingItemValueProps = {
  onPress: () => void
  hasBadge: boolean
  value: boolean
}

const SettingsItemValue = ({ value, hasBadge, onPress }: SettingItemValueProps): ReactElement => {
  const { t } = useTranslation('settings')
  if (hasBadge) {
    return (
      <BadgeContainer>
        <Badge enabled={value} />
        <Text> {value ? t('enabled') : t('disabled')}</Text>
      </BadgeContainer>
    )
  }
  return <Switch onValueChange={onPress} value={value} />
}

type SettingItemProps = {
  title: string
  description?: string
  onPress: () => Promise<void>
  bigTitle?: boolean
  role?: Role
  hasBadge?: boolean
  value: boolean | null
}

const SettingItem = ({
  title,
  description,
  onPress,
  value,
  bigTitle,
  role,
  hasBadge = false,
}: SettingItemProps): ReactElement => {
  const theme = useTheme()

  const styles = StyleSheet.create({
    title: {
      color: theme.colors.onSurface,
      fontSize: bigTitle ? TITLE_FONT_SIZE_BIG : TITLE_FONT_SIZE_REGULAR,
    },
    description: {
      color: theme.colors.onSurfaceVariant,
    },
  })

  return (
    <TouchableRipple borderless onPress={onPress} role={role ?? 'none'} accessible>
      <PadView>
        <ContentContainer>
          <View>
            <Text variant='body1' style={styles.title}>
              {title}
            </Text>
          </View>
          {!!description && (
            <View>
              <Text variant='body2' style={styles.description}>
                {description}
              </Text>
            </View>
          )}
        </ContentContainer>
        <FlexEndContainer>
          {value !== null && <SettingsItemValue onPress={onPress} hasBadge={hasBadge} value={value} />}
        </FlexEndContainer>
      </PadView>
    </TouchableRipple>
  )
}

export default SettingItem
