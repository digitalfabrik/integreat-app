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
  min-width: 112px;
  padding: 0 20px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  margin: 4px;
  ${props => props.disabled && `color: ${props.theme.palette.text.disabled};`}
` as typeof ListItemButton

const StyledList = styled(List)<{ vertical: boolean }>`
  display: flex;
  flex-flow: ${props => (props.vertical ? 'column' : 'row wrap')};
  justify-content: space-evenly;

  & li {
    width: auto;
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
            onClick={close}
            selected={item.code === activeItemCode}>
            <Typography variant='body1' fontWeight={item.code === activeItemCode ? 'bold' : 'normal'}>
              {item.name}
            </Typography>
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
