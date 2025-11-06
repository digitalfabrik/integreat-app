import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const GroupText = styled.Text`
  margin-top: 5px;
  padding: 10px 0;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.legacy.colors.textColor};
`
// Wrapper is necessary, because iOS doesn't display border for Text components.
const BorderWrapper = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.legacy.colors.themeColor};
  flex-flow: column wrap;
  align-items: flex-start;
`

type CityGroupProps = {
  children: string
}

const CityGroup = ({ children }: CityGroupProps): ReactElement => (
  <BorderWrapper>
    <GroupText>{children}</GroupText>
  </BorderWrapper>
)

export default CityGroup
