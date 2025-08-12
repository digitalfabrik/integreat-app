import styled from '@emotion/styled'
import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiModel } from 'shared/api'

import { PoiThumbnailPlaceholder } from '../assets'
import { helpers } from '../constants/theme'
import Button from './base/Button'

const ListItemContainer = styled.ul`
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
  display: flex;
  padding: clamp(10px, 1vh, 20px) 0;
  cursor: pointer;

  &:first-of-type {
    padding-top: 0;
  }
`

const Thumbnail = styled.img`
  width: clamp(70px, 10vh, 100px);
  height: clamp(70px, 10vh, 100px);
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: fill;
  border-radius: 10px;
`

const Distance = styled.div`
  ${helpers.adaptiveFontSize};
`

const Category = styled.div`
  ${helpers.adaptiveFontSize};
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
`

export const Description = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 0 22px;
  color: ${props => props.theme.legacy.colors.textColor};
  align-self: center;
  word-break: break-word;
  hyphens: auto;
`

const Title = styled.span`
  ${helpers.adaptiveFontSize};
  font-weight: 700;
`

const LinkContainer = styled(Button)`
  display: flex;
  flex: 1;
`

type PoiListItemProps = {
  poi: PoiModel
  selectPoi: () => void
  distance: number | null
}

const PoiListItem = ({ poi, distance, selectPoi }: PoiListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { thumbnail, title, category, slug } = poi

  return (
    <>
      <ListItemContainer id={slug}>
        <LinkContainer onClick={selectPoi} tabIndex={0} label={title}>
          <Thumbnail alt='' src={thumbnail || PoiThumbnailPlaceholder} />
          <Description>
            <Title>{title}</Title>
            {distance !== null && <Distance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</Distance>}
            <Category>{category.name}</Category>
          </Description>
        </LinkContainer>
      </ListItemContainer>
      <Divider sx={{ '&:last-child': { display: 'none' } }} />
    </>
  )
}

export default PoiListItem
