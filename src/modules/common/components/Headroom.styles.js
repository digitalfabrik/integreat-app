import styled from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'

export const HeaderWrapper = withPlatform(styled.div`
  position: ${props => props.platform.positionStickyDisabled ? 'static' : 'sticky'};
  top: ${props => props.top}px;
  z-index: 1;
  transform: translateY(${props => props.translateY}px);
  ${props => props.transition && `transition: transform 0.2s ease-out;`}
  ${props => props.static && `transition: none;`}
`)
