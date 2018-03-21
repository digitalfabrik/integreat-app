import styled from 'styled-components'

export const List = styled.div`
  & a {
    ${props => props.theme.helpers.removeA}
  }
`
