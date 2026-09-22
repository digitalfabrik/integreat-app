import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Switch from './base/Switch'
import Text from './base/Text'

const Container = styled(View)`
  flex-direction: row;
  padding: 16px;
`

const TextContainer = styled(View)`
  flex: 1;
`

type ExternalSourceListItemProps = {
  title: string
  description: string
  allowed: boolean
  onPress: (value: boolean) => void
}

const ExternalSourceListItem = ({
  title,
  description,
  allowed,
  onPress,
}: ExternalSourceListItemProps): ReactElement => {
  const theme = useTheme()
  return (
    <TouchableRipple
      onPress={() => onPress(!allowed)}
      accessible
      accessibilityRole='switch'
      accessibilityState={{ checked: allowed }}
      accessibilityLabel={title}
      accessibilityHint={description}>
      <Container>
        <TextContainer>
          <Text>{title}</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>{description}</Text>
        </TextContainer>
        <Switch
          value={allowed}
          onValueChange={onPress}
          accessible={false}
          importantForAccessibility='no-hide-descendants'
        />
      </Container>
    </TouchableRipple>
  )
}

export default ExternalSourceListItem
