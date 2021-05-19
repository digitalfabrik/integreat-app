import * as React from 'react'
import SelectorItemModel from '../models/SelectorItemModel'
import styled, { css } from 'styled-components'
import helpers from '../../theme/constants/helpers'
import dimensions from '../../theme/constants/dimensions'
import Tooltip from './Tooltip'

const Element = styled.span<{ $selected: boolean; $enabled: boolean }>`
  ${helpers.removeLinkHighlighting};
  height: ${dimensions.headerHeightLarge}px;
  min-width: 90px;
  flex: 1 1 auto;
  padding: 0 5px;
  font-size: 1.2em;
  line-height: ${dimensions.headerHeightLarge}px;
  text-align: center;
  white-space: nowrap;
  border-radius: 30px;
  transition: background-color 0.2s, border-radius 0.2s;
  user-select: none;

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    min-width: 70px;
    flex: 1 1 auto;
    font-size: 1em;
    line-height: ${dimensions.headerHeightSmall}px;
  }

  ${props => `color: ${props.$enabled ? props.theme.colors.textColor : props.theme.colors.textDisabledColor};`}

  ${props =>
    props.$selected
      ? 'font-weight: 700;'
      : `:hover {
          font-weight: 700;
          border-radius: 0;
        }`}
`

const BoldSpacer = styled.div`
  font-weight: 700;
  height: 0;
  overflow: hidden;
  visibility: hidden;
`

const Wrapper = styled.div<{ vertical: boolean }>`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  ${props =>
    props.vertical &&
    css`
      flex-flow: column;
      align-items: center;

      & ${Element} {
        flex: 1;
      }
    `}
`

type PropsType = {
  verticalLayout: boolean
  closeDropDown?: () => void
  items: Array<SelectorItemModel>
  activeItemCode?: string
  disabledItemTooltip: string
}

/**
 * Displays a Selector showing different items
 */
const Selector = ({ items, activeItemCode, verticalLayout, closeDropDown, disabledItemTooltip }: PropsType) => {
  return (
    <Wrapper vertical={verticalLayout}>
      {items.map(item => {
        if (item.href) {
          return (
            <Element
              key={item.code}
              // TODO As link
              // as={Link}
              // to={item.href}
              onClick={closeDropDown}
              $enabled={true}
              $selected={item.code === activeItemCode}>
              <BoldSpacer>{item.name}</BoldSpacer>
              {item.name}
            </Element>
          )
        } else {
          return (
            <Element
              as={Tooltip}
              key={item.code}
              text={disabledItemTooltip}
              flow='up'
              $enabled={false}
              $selected={false}>
              <BoldSpacer>{item.name}</BoldSpacer>
              {item.name}
            </Element>
          )
        }
      })}
    </Wrapper>
  )
}

export default Selector
