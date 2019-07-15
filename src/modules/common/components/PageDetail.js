// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

export const Identifier: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.textColor};
`

const DetailContainer: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.textColor};
`

type PropsType = {|
  identifier: string,
  information: string,
  theme: ThemeType
|}

class PageDetail extends React.PureComponent<PropsType> {
  render () {
    const { identifier, information, theme } = this.props
    return (
      <DetailContainer theme={theme}>
        <Identifier theme={theme}>{identifier}: </Identifier>
        {information}
      </DetailContainer>
    )
  }
}

export default PageDetail
