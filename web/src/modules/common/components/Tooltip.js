// @flow

import * as React from 'react'
import styled from 'styled-components'

const TooltipContainer = styled.div`
  .tooltip {
    position: relative;
  }
  
  .tooltip::before,
  .tooltip::after {
      line-height: 1;
      user-select: none;
      pointer-events: none;
      position: absolute;
      display: none;
      opacity: 0;
   
      /* opinions */
      text-transform: none; 
      font-size: .9em;
  }

  .tooltip::before {
      content: '';
      z-index: 1001;
      border: 5px solid transparent;
  }
  .tooltip::after {
      content: '${props => props.text}';
      z-index: 1000;
       
      /* most of the rest of this is opinion */
      font-family: Helvetica, sans-serif;
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
  
  .tooltip:hover::before,
  .tooltip:hover::after {
      display: block;
  }
  

  .tooltip::before {
      ${props => props.direction === 'up' ? 'bottom' : 'top'}: 100%;
      border-${props => props.direction === 'up' ? 'bottom' : 'top'}-width: 0;
      border-${props => props.direction === 'up' ? 'top' : 'bottom'}-color: #333;
  }
  .tooltip::after {
      ${props => props.direction === 'up' ? 'bottom' : 'top'}: calc(100% + 5px);
  }
  .tooltip::before,
  .tooltip::after {
      left: 50%;
      transform: translate(-50%, ${props => props.direction === 'up' ? '-.5em' : '.5em'});
  }
  
  @keyframes tooltips-vert {
    to {
      opacity: .9;
      transform: translate(-50%, 0);
    }
  }
  
  .tooltip:hover::before,
  .tooltip:hover::after {
      animation: 
          tooltips-vert 
          300ms 
          ease-out
          forwards;
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
     <div className={'tooltip'}>
       {children}
     </div>
  </TooltipContainer>
}
