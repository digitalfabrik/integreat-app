import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useCallback } from 'react'

import { TileModel } from 'shared'
import { useLoadAsync } from 'shared/api'

import { fetchObjectCached } from '../utils'
import Link from './base/Link'

export const StyledButton = styled(Button)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'flex-start',
  width: 'min(160px, 36vw)',
  gap: 8,
}) as typeof Button

const Outline = styled('div')(({ theme }) => ({
  width: 'min(140px, 32vw)',
  height: 'min(140px, 32vw)',

  ...(theme.isContrastTheme && {
    ':hover': {
      outline: `8px solid ${theme.palette.secondary.main}`,
      borderRadius: 24,
    },
  }),
}))

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  transition: 'transform 0.2s',
  objectFit: 'contain',

  ':hover': {
    transform: 'scale(1.01)',
  },

  ...(theme.isContrastTheme && {
    filter: 'invert(1) saturate(0) brightness(7)',
  }),
}))

type TileProps = {
  tile: TileModel
}

const Tile = ({ tile }: TileProps): ReactElement => {
  const { data } = useLoadAsync(useCallback(() => fetchObjectCached(tile.thumbnail), [tile.thumbnail]))

  return (
    <StyledButton component={Link} to={tile.path} color='inherit' disableFocusRipple>
      <Outline>
        <StyledImage alt='' src={data?.objectUrl} />
      </Outline>
      <Typography variant='body1' textAlign='center' textTransform='none'>
        {tile.title}
      </Typography>
    </StyledButton>
  )
}

export default Tile
