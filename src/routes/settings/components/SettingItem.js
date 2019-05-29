// @flow

import * as React from 'react'
import { TouchableNativeFeedback, View } from 'react-native'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

type PropType = {
  title: string,
  description: ?string,
  onPress: ?() => void,
  children: ?React.Node,
  theme: ThemeType
}
const PadView = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding-vertical: 8px;
`

const RightContentContainer = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: flex-end;
`

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
`

const Description = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
`

export default class SettingItem extends React.Component<PropType> {
  render () {
    const {title, description, onPress, children, theme} = this.props

    return <TouchableNativeFeedback onPress={onPress}>
      <PadView>
        <ContentContainer>
          <View><Title theme={theme}>{title}</Title></View>
          {description && <View><Description theme={theme}>{description}</Description></View>}
        </ContentContainer>
        <RightContentContainer>{children}</RightContentContainer>
      </PadView>
    </TouchableNativeFeedback>
  }
}
