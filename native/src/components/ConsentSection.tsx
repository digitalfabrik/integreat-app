import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Divider, Switch } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Text from './base/Text'

const Container = styled(View)`
  flex-direction: row;
  padding: 16px;
`

const TextContainer = styled(View)`
  flex: 1;
`

type ConsentSectionProps = {
  title: string
  description: string
  allowed: boolean
  onPress: (value: boolean) => void
}

const ConsentSection = ({ title, description, allowed, onPress }: ConsentSectionProps): ReactElement => {
  const theme = useTheme()
  return (
    <>
      <Container>
        <TextContainer>
          <Text>{title}</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>{description}</Text>
        </TextContainer>
        <Switch onValueChange={onPress} value={allowed} />
      </Container>
      <Divider />
    </>
  )
}

export default ConsentSection
