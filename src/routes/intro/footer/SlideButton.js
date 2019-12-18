// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const ButtonContainer: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
`

const ButtonText: StyledComponent<{ backgroundColor: string }, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  background-color: ${props => props.backgroundColor};
  font-size: 18px;
  text-align: center;
  padding: 8px 12px;
  border-radius: 3px;
`

type PropsType = {|
  label: string,
  onPress: () => void | Promise<void>,
  backgroundColor?: string,
  theme: ThemeType
|}

class SlideButton extends React.Component<PropsType> {
  render () {
    const { label, onPress, backgroundColor, theme } = this.props
    return <ButtonContainer theme={theme} onPress={onPress}>
      <ButtonText theme={theme} backgroundColor={backgroundColor || theme.colors.backgroundColor}>
        {label}
      </ButtonText>
    </ButtonContainer>
  }
}

export default SlideButton
