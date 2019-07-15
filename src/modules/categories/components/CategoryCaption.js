// @flow

import styled from 'styled-components/native'

export default styled.Text`
  align-self: center;
  padding: 15px 5px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  flex: 1;
`
