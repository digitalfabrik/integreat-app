import MuiList from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useScrollDimensions } from '../../hooks/useDimensions'
import { withDividers } from '../../utils'
import Failure from '../Failure'

const StyledListSubheader = styled(ListSubheader)<{ component?: ElementType }>({
  transition: 'top 0.2s ease-out',
})

type StickyListSubheaderProps = {
  children: ReactNode
  component?: ElementType
}

export const StickyListSubheader = ({ children, component }: StickyListSubheaderProps): ReactElement => {
  // Subscribes to the scroll position itself, so that rerendering on scroll is limited to the subheader
  const { stickyTop } = useScrollDimensions()
  return (
    <StyledListSubheader component={component} style={{ top: stickyTop }}>
      {children}
    </StyledListSubheader>
  )
}

type ListProps = {
  items: ReactElement[]
  noItemsMessage?: string | ReactElement
  disablePadding?: boolean
  className?: string
  showDividers?: boolean
}

const List = ({
  items,
  noItemsMessage,
  disablePadding,
  className,
  showDividers = true,
}: ListProps): ReactElement | null => {
  const { t } = useTranslation()
  const errorMessage = noItemsMessage ?? t($ => $.error.nothingFound)
  if (items.length === 0) {
    return typeof errorMessage === 'string' ? <Failure errorMessage={errorMessage} /> : errorMessage
  }
  return (
    <MuiList className={className} disablePadding={disablePadding}>
      {showDividers ? withDividers(items) : items}
    </MuiList>
  )
}

export default List
