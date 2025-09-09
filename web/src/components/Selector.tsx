import { css } from '@emotion/react'
import Tooltip from '@mui/material/Tooltip'
import { styled, Theme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import Link from './base/Link'

const selectorItemStyle = ({ theme }: { theme: Theme }) => css`
  height: 64px;
  min-width: 90px;
  padding: 0 5px;
  font-size: 1.2em;
  line-height: 64px;
  text-align: center;
  white-space: nowrap;
  border-radius: 30px;
  transition:
    background-color 0.2s,
    border-radius 0.2s;
  user-select: none;

  ${theme.breakpoints.down('md')} {
    width: 100%;
    flex: 1 1 auto;
    font-size: 1em;
  }
`

const SelectorItem = styled(Link)<{ selected: boolean }>`
  ${selectorItemStyle};
  color: ${props => props.theme.legacy.colors.textColor};
  ${props =>
    props.selected
      ? 'font-weight: 700;'
      : `&:hover {
          font-weight: 700;
          border-radius: 0;
        }`}
`

const DisabledSelectorItem = styled('div')`
  ${selectorItemStyle};
  color: ${props => props.theme.legacy.colors.textDisabledColor};
`

const BoldSpacer = styled('div')`
  font-weight: 700;
  height: 0;
  overflow: hidden;
  visibility: hidden;
`

const Wrapper = styled('div')<{ vertical: boolean }>`
  display: flex;
  width: 100%;
  flex-flow: ${props => (props.vertical ? 'column' : 'row wrap')};
  justify-content: space-evenly;
  color: ${props => props.theme.legacy.colors.textColor};
`

type SelectorProps = {
  verticalLayout: boolean
  close?: () => void
  items: SelectorItemModel[]
  activeItemCode?: string
  disabledItemTooltip: string
}

const Selector = ({
  items,
  activeItemCode,
  verticalLayout,
  close,
  disabledItemTooltip,
}: SelectorProps): ReactElement => (
  <Wrapper vertical={verticalLayout}>
    {items.map(item =>
      item.href ? (
        <SelectorItem
          key={item.code}
          to={item.href}
          aria-selected={item.code === activeItemCode}
          onClick={close ?? (() => undefined)}
          selected={item.code === activeItemCode}>
          <BoldSpacer>{item.name}</BoldSpacer>
          {item.name}
        </SelectorItem>
      ) : (
        <Tooltip key={item.code} title={disabledItemTooltip}>
          <DisabledSelectorItem>
            <BoldSpacer>{item.name}</BoldSpacer>
            {item.name}
          </DisabledSelectorItem>
        </Tooltip>
      ),
    )}
  </Wrapper>
)

export default Selector
