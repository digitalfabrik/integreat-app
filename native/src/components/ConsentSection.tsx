import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import ItemSeparator from './base/ItemSeparator'
import SettingsSwitch from './base/SettingsSwitch'
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
  allowed: boolean
  onPress: (type: string, value: boolean) => void
}

const ConsentSection = ({ title, description, allowed, onPress }: ConsentSectionProps): ReactElement => {

  return (
    <>
      <Container>
        <TextContainer>
          <Text>{title}</Text>
          <Description>{description}</Description>
        </TextContainer>
        <SettingsSwitch
          onPress={val => {
            setAllow(val)
            onPress(title, val)
          }}
          value={allow}
        />
      </Container>
      <ItemSeparator />
    </>
  )
}

export default ConsentSection
