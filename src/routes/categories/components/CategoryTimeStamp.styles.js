import styled from 'styled-components'

export const TimeStamp = styled.p`
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
  color: ${props => props.theme.colors.textSecondaryColor};
  padding-top: 15px;
`
