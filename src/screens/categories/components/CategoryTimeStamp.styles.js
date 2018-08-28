import styled from 'styled-components'

export const TimeStamp = styled.Text`
  padding-top: 15px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
`
