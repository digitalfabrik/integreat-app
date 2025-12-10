import styled from 'styled-components/native'

const HighlightBox = styled.View`
  background-color: ${props => props.theme.colors.surface};
  elevation: 1;
  shadow-color: ${props => props.theme.colors.onSurface};
  shadow-offset: 0 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
`

export default HighlightBox
