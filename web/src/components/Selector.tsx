import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import Link from './base/Link'

const SelectorItemButton = styled(ListItemButton)`
  height: 48px;
  min-width: 112px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
` as typeof ListItemButton

const StyledList = styled(List, {
  shouldForwardProp: prop => prop !== 'vertical',
})<{ vertical: boolean }>`
  display: flex;
  flex-flow: ${props => (props.vertical ? 'column' : 'row wrap')};
  justify-content: space-evenly;
  gap: 4px;
  padding: 8px 0;
`

const StyledListItem = styled(ListItem)`
  width: auto;
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
        <StyledListItem key={item.code} disablePadding>
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
        </StyledListItem>
      ) : (
        <Tooltip key={item.code} title={disabledItemTooltip}>
          <StyledListItem disablePadding>
            <SelectorItemButton disabled>{item.name}</SelectorItemButton>
          </StyledListItem>
        </Tooltip>
      ),
    )}
  </StyledList>
)

export default Selector
