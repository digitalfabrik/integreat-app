import styled from 'styled-components/native'

const HighlightBox = styled.View<{ $padding?: boolean }>`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  elevation: 1;
  shadow-color: ${props => props.theme.colors.textColor};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;

  ${props => props.$padding && 'padding: 20px;'}
  ${props => props.$padding && 'border-radius: 4px;'}
`

export default HighlightBox
