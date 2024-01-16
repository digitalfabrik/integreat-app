import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import SelectorItemModel from '../models/SelectorItemModel'
import Tooltip from './Tooltip'
import Button from './base/Button'

const Element = styled(Button)<{ $selected: boolean; $enabled: boolean }>`
  ${helpers.removeLinkHighlighting};
  block-size: ${dimensions.headerHeightLarge}px;
  min-inline-size: 90px;
  flex: 1 1 auto;
  padding: 0 5px;
  font-size: 1.2em;
  line-height: ${dimensions.headerHeightLarge}px;
  text-align: center;
  white-space: nowrap;
  border-radius: 30px;
  transition:
    background-color 0.2s,
    border-radius 0.2s;
  user-select: none;

  @media ${dimensions.smallViewport} {
    block-size: ${dimensions.headerHeightSmall}px;
    inline-size: 100%;
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
  block-size: 0;
  overflow: hidden;
  visibility: hidden;
`

const Wrapper = styled.div<{ vertical: boolean }>`
  display: flex;
  inline-size: 100%;
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

type SelectorProps = {
  verticalLayout: boolean
  closeDropDown?: () => void
  items: Array<SelectorItemModel>
  activeItemCode?: string
  disabledItemTooltip: string
}

/**
 * Displays a Selector showing different items
 */
const Selector = ({
  items,
  activeItemCode,
  verticalLayout,
  closeDropDown,
  disabledItemTooltip,
}: SelectorProps): ReactElement => (
  <Wrapper vertical={verticalLayout} id='languageSelector'>
    {items.map(item => {
      if (item.href) {
        return (
          <Element
            key={item.code}
            role='option'
            as={Link}
            to={item.href}
            onClick={closeDropDown}
            aria-selected={item.code === activeItemCode}
            tabIndex={0}
            $enabled
            $selected={item.code === activeItemCode}>
            <BoldSpacer>{item.name}</BoldSpacer>
            {item.name}
          </Element>
        )
      }
      return (
        <Element as={Tooltip} key={item.code} text={disabledItemTooltip} flow='up' $enabled={false} $selected={false}>
          <BoldSpacer>{item.name}</BoldSpacer>
          {item.name}
        </Element>
      )
    })}
  </Wrapper>
)

export default Selector
