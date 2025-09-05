import Divider from '@mui/material/Divider'
import MuiIcon from '@mui/material/Icon'
import MUIListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import Link from './base/Link'

const Thumbnail = styled('img')<{ thumbnailSize?: number }>`
  width: ${props => props.thumbnailSize ?? '100'}px;
  height: ${props => props.thumbnailSize ?? '100'}px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
  align-self: center;
`

export const Description = styled('div')`
  display: flex;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 8px;
  overflow-wrap: anywhere;
  gap: 8px;
`

type ListItemProps = {
  thumbnail?: string
  thumbnailSize?: number
  path: string
  title: string
  Icon?: ReactElement | null
  children?: ReactNode
}

const ListItem = ({ path, title, thumbnail, thumbnailSize, children, Icon }: ListItemProps): ReactElement => (
  <>
    <MUIListItem component={Link} to={path}>
      {!!thumbnail && <Thumbnail alt='' src={thumbnail} thumbnailSize={thumbnailSize} />}
      <ListItemText
        primary={
          <Typography component='div' variant='title2'>
            {title}
          </Typography>
        }
        secondary={
          <Typography component='div' variant='body2'>
            {children}
          </Typography>
        }
      />
      <MuiIcon>{Icon}</MuiIcon>
    </MUIListItem>
    <Divider />
  </>
)

export default ListItem
