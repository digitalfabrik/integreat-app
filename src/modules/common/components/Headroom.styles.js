import styled from 'styled-components'

export const HeaderWrapper = styled.div`
  position: sticky;
  top: ${props => props.top}px;
  z-index: 1;
  transform: translateY(${props => props.translateY}px);
  ${props => props.transition && `transition: transform 0.2s ease-out;`}
  ${props => props.static && `transition: none;`}
`
