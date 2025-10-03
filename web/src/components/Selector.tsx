import List from '@mui/material/List'
import ListItem, { listItemClasses } from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import Link from './base/Link'

const SelectorItemButton = styled(ListItemButton)<{ selected?: boolean; disabled?: boolean }>`
  height: 48px;
  min-width: 104px;
  padding: 0 20px;
  font-size: 1.2em;
  line-height: 64px;
  white-space: nowrap;
  border-radius: 30px;
  transition:
    background-color 0.2s,
    border-radius 0.2s;
  user-select: none;
  display: flex;
  justify-content: center;
  margin: 5px;
  ${props => props.disabled && `color: ${props.theme.legacy.colors.textDisabledColor};`}
` as typeof ListItemButton

const StyledList = styled(List)<{ vertical: boolean }>`
  display: flex;
  width: 100%;
  flex-flow: ${props => (props.vertical ? 'column' : 'row wrap')};
  justify-content: space-evenly;
  color: ${props => props.theme.legacy.colors.textColor};
  padding: 0;

  & .${listItemClasses.root} {
    width: auto;
    flex: ${props => (props.vertical ? '1 1 auto' : '0 0 auto')};
    ${props => !props.vertical && 'display: inline-flex;'}
  }
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
  <StyledList vertical={verticalLayout}>
    {items.map(item =>
      item.href ? (
        <ListItem key={item.code} disablePadding>
          <SelectorItemButton
            component={Link}
            to={item.href}
            aria-selected={item.code === activeItemCode}
            onClick={close ?? (() => undefined)}
            selected={item.code === activeItemCode}>
            <Typography variant={item.code === activeItemCode ? 'title2' : 'body1'}>{item.name}</Typography>
          </SelectorItemButton>
        </ListItem>
      ) : (
        <Tooltip key={item.code} title={disabledItemTooltip}>
          <ListItem disablePadding>
            <SelectorItemButton disabled>{item.name}</SelectorItemButton>
          </ListItem>
        </Tooltip>
      ),
    )}
  </StyledList>
)

export default Selector
