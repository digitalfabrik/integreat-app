// @flow

import * as React from 'react'
import styled from 'styled-components'

const TooltipContainer = styled.div`
   position: relative;
  
  ::before,
  ::after {
      line-height: 1;
      user-select: none;
      pointer-events: none;
      position: absolute;
      display: none;
      opacity: 0;
   
      /* opinions */
      text-transform: none; 
      font-size: .9rem;
  }

  ::before {
      content: '';
      z-index: 1001;
      border: 5px solid transparent;
  }
  ::after {
      content: '${props => props.text}';
      z-index: 1000;
       
      /* most of the rest of this is opinion */
      text-align: center;
       
      /* 
      Let the content set the size of the tooltips 
      but this will also keep them from being obnoxious
      */
      min-width: 3em;
      max-width: 21em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
       
      /* visible design of the tooltip bubbles */
      padding: 1ch 1.5ch;
      border-radius: .3ch;
      box-shadow: 0 1em 2em -.5em rgba(0, 0, 0, 0.35);
      background: #333;
      color: #fff;
  }
  
  :hover::before,
  :hover::after {
      display: block;
  }

  ::before {
      ${props => props.direction === 'up' ? 'bottom' : 'top'}: 100%;
      border-${props => props.direction === 'up' ? 'bottom' : 'top'}-width: 0;
      border-${props => props.direction === 'up' ? 'top' : 'bottom'}-color: #333;
  }
  ::after {
      ${props => props.direction === 'up' ? 'bottom' : 'top'}: calc(100% + 5px);
  }
  ::before,
  ::after {
      left: 50%;
      transform: translate(-50%, ${props => props.direction === 'up' ? '-.5em' : '.5em'});
  }
  
  @keyframes tooltips-vert {
    to {
      opacity: .9;
      transform: translate(-50%, 0);
    }
  }
  
  :hover::before,
  :hover::after {
      animation: tooltips-vert 300ms ease-out forwards;
  }
`

type PropsType = {|
  children: React.Node,
  text: ?string,
  direction: 'up' | 'down' | 'left' | 'right'
|}

export default ({ children, text, direction }: PropsType) => {
  if (!text) {
    return children
  }

  return <TooltipContainer text={text} direction={direction}>
       {children}
  </TooltipContainer>
}
