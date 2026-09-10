import shouldForwardProp from '@emotion/is-prop-valid'
import MuiList from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { withDividers } from '../../utils'
import Failure from '../Failure'

export const StickyListSubheader = styled(ListSubheader, { shouldForwardProp })<{
  stickyTop: number
  component?: ElementType
}>(({ stickyTop }) => ({
  top: stickyTop,
  transition: 'top 0.2s ease-out',
}))

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
