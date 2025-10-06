import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import Link from './base/Link'

const SelectorItemButton = styled(ListItemButton)<{ disabled?: boolean }>`
  height: 48px;
  min-width: 104px;
  padding: 0 20px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  margin: 4px;
  ${props => props.disabled && `color: ${props.theme.palette.text.disabled};`}

  ${props => props.theme.breakpoints.down('lg')} {
    padding: 0 16px;
    min-width: 96px;
    height: 40px;
  }
` as typeof ListItemButton

const StyledList = styled(List)<{ vertical: boolean }>`
  display: flex;
  flex-flow: ${props => (props.vertical ? 'column' : 'row wrap')};
  justify-content: space-evenly;
  color: ${props => props.theme.palette.text.primary};

  & li {
    width: auto;
    ${props => (props.vertical ? 'flex: 1 1 auto;' : 'flex: 0 0 auto;')}
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
  <StyledList disablePadding vertical={verticalLayout}>
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
