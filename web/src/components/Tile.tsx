import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useCallback } from 'react'

import { TileModel } from 'shared'
import { useLoadAsync } from 'shared/api'

import { fetchObjectCached } from '../utils'
import Link from './base/Link'

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-start;
  width: min(160px, 36vw);
  cursor: pointer;
  gap: 8px;
`

const Outline = styled('div')`
  width: min(140px, 32vw);
  height: min(140px, 32vw);

  :hover {
    ${props =>
      props.theme.isContrastTheme &&
      `
        outline: 8px solid ${props.theme.palette.secondary.main};
        border-radius: 24px;
      `}
  }
`

const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
  object-fit: contain;

  filter: ${props => (props.theme.isContrastTheme ? 'invert(1) saturate(0) brightness(7)' : 'none')};

  :hover {
    transform: scale(1.01);
  }
`

type TileProps = {
  tile: TileModel
}

const Tile = ({ tile }: TileProps): ReactElement => {
  const { data } = useLoadAsync(useCallback(() => fetchObjectCached(tile.thumbnail), [tile.thumbnail]))

  return (
    <StyledLink to={tile.path}>
      <Outline>
        <StyledImage alt='' src={data?.objectUrl} />
      </Outline>
      <Typography variant='body1' textAlign='center'>
        {tile.title}
      </Typography>
    </StyledLink>
  )
}

export default Tile
