import React, { ReactElement, useEffect, useState } from 'react'
import { View, Switch } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ItemSeparator } from './Consent'
import Text from './base/Text'

const Container = styled(View)`
  flex-direction: row;
  padding: 16px;
`

const TextContainer = styled(View)`
  flex: 1;
`

const Description = styled(Text)`
  color: ${props => props.theme.colors.textSecondaryColor};
`

type ConsentSectionProps = {
  title: string
  description: string
  initialSwitchValue: boolean
  onPress: (type: string, value: boolean) => void
}

const ConsentSection = ({ title, description, initialSwitchValue, onPress }: ConsentSectionProps): ReactElement => {
  const [allow, setAllow] = useState<boolean>(initialSwitchValue)

  useEffect(() => {
    setAllow(initialSwitchValue)
  }, [initialSwitchValue])

  const theme = useTheme()
  return (
    <>
      <Container>
        <TextContainer>
          <Text>{title}</Text>
          <Description>{description}</Description>
        </TextContainer>
        <Switch
          thumbColor={theme.colors.themeColor}
          trackColor={{
            true: theme.colors.themeColor,
            false: theme.colors.textSecondaryColor,
          }}
          accessibilityRole='switch'
          value={allow}
          onValueChange={val => {
            setAllow(val)
            onPress(title, val)
          }}
        />
      </Container>
      <ItemSeparator />
    </>
  )
}

export default ConsentSection
