import styled from 'styled-components'

// fixme: H1 is connected to redux state -> not a plain old component

export const H1 = styled.h1`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;
  
  @media ${props => props.theme.dimensions.smallViewport} {
    margin: 10px 0;
  }
`
