// @flow

import * as React from 'react'
import styled from 'styled-components'
import dimensions from '../../theme/constants/dimensions'

const renderPseudoClasses = (direction: string) => `
    ::before {
    ${direction === 'up'
  ? `
        bottom: 100%;
        border-bottom-width: 0;
        border-top-color: #333;
    `
  : ''}
    ${direction === 'down'
  ? `
        top: 100%;
        border-top-width: 0;
        border-bottom-color: #333;
    `
  : ''}
    ${direction === 'left'
  ? `
        top: 50%;
        border-right-width: 0;
        border-left-color: #333;
        left: calc(0em - 5px);
        transform: translate(0, -50%);
    `
  : ''}
    ${direction === 'right'
  ? `
        top: 50%;
        border-left-width: 0;
        border-right-color: #333;
        right: calc(0em - 5px);
        transform: translate(0, -50%);
    `
  : ''}
    }
    ::after {
    ${direction === 'up'
  ? `
        bottom: calc(100% + 5px);
    `
  : ''}
    ${direction === 'down'
  ? `
        top: calc(100% + 5px);
    `
  : ''}
    ${direction === 'left'
  ? `
        top: 50%;
        right: calc(100% + 5px);
        transform: translate(0, -50%);
    `
  : ''}
    ${direction === 'right'
  ? `
        top: 50%;
        left: calc(100% + 5px);
        transform: translate(0, -50%);
    `
  : ''}
    }

    ::before,
    ::after {
    ${(direction === 'up' || direction === 'down')
  ? `
        left: 50%;
        transform: translate(-50%, 0);
    `
  : ''}
    }
`

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
      font-size: 16px;
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


  @media not ${dimensions.minMaxWidth} {
    ${props => renderPseudoClasses(props.lowWidthFallback)}
  }
  @media ${dimensions.minMaxWidth} {
    ${props => renderPseudoClasses(props.direction)}
  }
  
  @keyframes tooltips {
    to {
      opacity: .9;
    }
  }
  
  :hover::before,
  :hover::after {
      animation: tooltips 300ms ease-out forwards;
  }
`

type PropsType = {|
  children: React.Node,
  text: ?string,
  direction: 'up' | 'down',
  lowWidthFallback?: 'left' | 'right'
|}

export default ({ children, text, direction, lowWidthFallback }: PropsType) => {
  if (!text) {
    return children
  }

  return <TooltipContainer text={text} direction={direction} lowWidthFallback={lowWidthFallback ?? direction}>
    {children}
  </TooltipContainer>
}
