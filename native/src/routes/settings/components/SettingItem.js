// @flow

import * as React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants'
import Touchable from '../../../modules/platform/components/Touchable'
import type { AccessibilityRole } from 'react-native/Libraries/Components/View/ViewAccessibility'

type PropType = {
  title: string,
  description: ?string,
  onPress: ?() => void,
  children: ?React.Node,
  theme: ThemeType,
  bigTitle?: boolean,
  accessibilityRole?: AccessibilityRole
}

const PadView: StyledComponent<{}, ThemeType, *> = styled.View`
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
`

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`

const Title: StyledComponent<{ bigTitle: boolean }, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  ${props => (props.bigTitle ? 'font-size: 18px;' : '')}
`

const Description = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
`

export default class SettingItem extends React.Component<PropType> {
  render() {
    const { title, description, onPress, children, bigTitle, theme, accessibilityRole } = this.props

    return (
      <Touchable onPress={onPress} accessibilityRole={accessibilityRole}>
        <PadView theme={theme}>
          <ContentContainer>
            <View>
              <Title theme={theme} bigTitle={bigTitle || false}>
                {title}
              </Title>
            </View>
            {description && (
              <View>
                <Description theme={theme}>{description}</Description>
              </View>
            )}
          </ContentContainer>
          <RightContentContainer>{children}</RightContentContainer>
        </PadView>
      </Touchable>
    )
  }
}
