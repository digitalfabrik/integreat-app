// @flow

import * as React from 'react'
import { useContext } from 'react'
import styled, { css } from 'styled-components'
import dimensions from '../../theme/constants/dimensions'
import PlatformContext from '../../platform/PlatformContext'
import type { StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'

// Works for Chrome > 69, Firefox > 41, RTL/LTR support does not work for IE and Safari
const toLogicalProperty = (prop: string, direction: 'ltr' | 'rtl', supportsLogicalProperties: boolean): string => {
  if (!supportsLogicalProperties) {
    if (direction === 'rtl') {
      if (prop.includes('left')) {
        return prop.replace('left', 'right')
      } else {
        return prop.replace('right', 'left')
      }
    }

    return prop
  }

  switch (prop) {
    case 'right':
      return 'inset-inline-end'
    case 'left':
      return 'inset-inline-start'
    case 'border-left-width':
      return 'border-inline-start-width'
    case 'border-right-width':
      return 'border-inline-end-width'
    case 'border-left-color':
      return 'border-inline-start-color'
    case 'border-right-color':
      return 'border-inline-end-color'
  }

  throw Error('Unknown property.')
}

type FlowType = 'left' | 'right' | 'up' | 'down'

const pseudosMixin = (flow: FlowType, toLogicalProperty: (prop: string) => string) => css`
  /* CSS Triangle: https://css-tricks.com/snippets/css/css-triangle/ */
  ::before {
    ${flow === 'up' &&
    `
      bottom: 100%;
      border-bottom-width: 0;
      border-top-color: #333;
    `}
    ${flow === 'down' &&
    `
      top: 100%;
      border-top-width: 0;
      border-bottom-color: #333;
    `}
    ${flow === 'left' &&
    `
      ${toLogicalProperty('border-right-width')}: 0;
      ${toLogicalProperty('border-left-color')}: #333;
      ${toLogicalProperty('left')}: -5px;
    `}
    ${flow === 'right' &&
    `
      ${toLogicalProperty('border-left-width')}: 0;
      ${toLogicalProperty('border-right-color')}: #333;
      ${toLogicalProperty('right')}: -5px;
    `}
  }

  ::after {
    ${flow === 'up' &&
    `
      bottom: calc(99% + 5px);
    `}
    ${flow === 'down' &&
    `
      top: calc(99% + 5px);
    `}
    ${flow === 'left' &&
    `
      ${toLogicalProperty('right')}: calc(99% + 5px);
    `}
    ${flow === 'right' &&
    `
      ${toLogicalProperty('left')}: calc(99% + 5px);
    `}
  }

  ::before,
  ::after {
    ${(flow === 'left' || flow === 'right') &&
    `
      top: 50%;
      transform: translate(0, -50%);
    `}
    ${(flow === 'up' || flow === 'down') &&
    `
      left: 50%;
      transform: translate(-50%, 0);
    `}
  }
`

const TooltipContainer: StyledComponent<
  {|
    text: string,
    flow: FlowType,
    smallViewportFlow: FlowType,
    mediumViewportFlow: FlowType,
    toLogicalProperty: (prop: string) => string
  |},
  ThemeType,
  *
> = styled.div`
  position: relative;

  ::before,
  ::after {
    line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    display: none;
    opacity: 0;
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

    /* Content props */
    text-align: center;
    min-width: 3em;
    max-width: 21em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* visible design of the tooltip bubbles */
    padding: 10px 15px;
    border-radius: 3px;
    background: #333;
    color: #fff;
  }

  :hover::before,
  :hover::after {
    display: block;
  }

  /* over 1100px */
  @media ${dimensions.minMaxWidth} {
    ${props => pseudosMixin(props.flow, props.toLogicalProperty)}
  }
  /* below 750px */
  @media screen and ${dimensions.smallViewport} {
    ${props => pseudosMixin(props.smallViewportFlow, props.toLogicalProperty)}
  }
  /* inbetween */
  @media screen and ${dimensions.mediumViewport} {
    ${props => pseudosMixin(props.mediumViewportFlow, props.toLogicalProperty)}
  }

  @keyframes tooltips {
    to {
      opacity: 1;
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
  flow: FlowType,
  /**
   * For browsers which do not support logical props like IE and Safari you need to pass this explicitly
   */
  direction?: 'ltr' | 'rtl',
  mediumViewportFlow?: FlowType,
  smallViewportFlow?: FlowType,
  className?: string
|}

const Tooltip = ({ children, text, flow, mediumViewportFlow, smallViewportFlow, className, direction }: PropsType) => {
  const platform = useContext(PlatformContext)

  if (!text) {
    return children
  }

  return (
    <TooltipContainer
      className={className}
      text={text}
      flow={flow}
      mediumViewportFlow={mediumViewportFlow ?? flow}
      smallViewportFlow={smallViewportFlow ?? mediumViewportFlow ?? flow}
      toLogicalProperty={(prop: string) =>
        toLogicalProperty(prop, direction || 'ltr', platform.supportsLogicalProperties)
      }>
      {children}
    </TooltipContainer>
  )
}

export default Tooltip
