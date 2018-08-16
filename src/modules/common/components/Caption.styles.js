// @flow

import styled from 'styled-components'

export const H1 = styled.h1`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;
  
  @media ${props => props.theme.dimensions.smallViewport} {
    margin: 10px 0;
  }
`
