import styled from 'styled-components'

export default styled.Text`
  flex-grow: 1;
  padding: 15px 5px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`
