import { css, SerializedStyles, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import dimensions from '../constants/dimensions'
import SelectorItemModel from '../models/SelectorItemModel'
import Button from './base/Button'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

const selectorItemStyle = ({ theme }: { theme: Theme }): SerializedStyles => css`
  height: ${dimensions.headerHeightLarge}px;
  min-width: 90px;
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
  color: ${theme.colors.textColor};

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    width: 100%;
    flex: 1 1 auto;
    font-size: 1em;
    line-height: ${dimensions.headerHeightSmall}px;
  }
`

const SelectorItem = styled(Button)<{ $selected: boolean }>`
  ${selectorItemStyle};
  ${props =>
    props.$selected
      ? 'font-weight: 700;'
      : `&:hover {
          font-weight: 700;
          border-radius: 0;
        }`}
`

const DisabledSelectorItem = styled.div`
  ${selectorItemStyle};
  color: ${props => props.theme.colors.textDisabledColor};
`

const BoldSpacer = styled.div`
  font-weight: 700;
  height: 0;
  overflow: hidden;
  visibility: hidden;
`

const Wrapper = styled.div<{ $vertical: boolean }>`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  ${props =>
    props.$vertical &&
    css`
      flex-flow: column;
      align-items: center;

      & ${SelectorItem} {
        flex: 1;
      }
    `}
`

type SelectorProps = {
  verticalLayout: boolean
  closeDropDown?: () => void
  items: SelectorItemModel[]
  activeItemCode?: string
  disabledItemTooltip: string
}

const Selector = ({
  items,
  activeItemCode,
  verticalLayout,
  closeDropDown,
  disabledItemTooltip,
}: SelectorProps): ReactElement => (
  <Wrapper $vertical={verticalLayout} id='languageSelector'>
    {items.map(item =>
      item.href ? (
        <SelectorItem
          key={item.code}
          onClick={closeDropDown ?? (() => undefined)}
          label=''
          $selected={item.code === activeItemCode}>
          <Link to={item.href} aria-selected={item.code === activeItemCode}>
            <BoldSpacer>{item.name}</BoldSpacer>
            {item.name}
          </Link>
        </SelectorItem>
      ) : (
        <Tooltip id={item.code} key={item.code} tooltipContent={disabledItemTooltip}>
          <DisabledSelectorItem id={item.code}>
            <BoldSpacer>{item.name}</BoldSpacer>
            {item.name}
          </DisabledSelectorItem>
        </Tooltip>
      ),
    )}
  </Wrapper>
)

export default Selector
