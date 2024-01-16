import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GeoJsonPoi } from 'api-client'

import { PoiThumbnailPlaceholder } from '../assets'
import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import Button from './base/Button'

const ListItemContainer = styled.ul`
  font-family: ${props => props.theme.fonts.web.contentFont};
  display: flex;
  padding: clamp(10px, 1vh, 20px) 0;
  border-block-end: 1px solid ${props => props.theme.colors.borderColor};
  cursor: pointer;

  @media screen and ${dimensions.smallViewport} {
    &:last-child {
      border-block-end: none;
    }
  }

  &:first-child {
    padding-block-start: 0;
  }
`

const Thumbnail = styled.img`
  inline-size: clamp(70px, 10vh, 100px);
  block-size: clamp(70px, 10vh, 100px);
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
  color: ${props => props.theme.colors.textSecondaryColor};
`

export const Description = styled.div`
  display: flex;
  justify-content: center;
  block-size: 100%;
  min-inline-size: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 0 22px;
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
  poi: GeoJsonPoi
  selectPoi: (feature: GeoJsonPoi | null, restoreScrollPosition: boolean) => void
}

const PoiListItem = ({ poi, selectPoi }: PoiListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { thumbnail, title, distance, category, slug } = poi

  const onClickItem = () => {
    selectPoi(poi, true)
  }

  return (
    <ListItemContainer id={slug}>
      <LinkContainer onClick={onClickItem} tabIndex={0} ariaLabel={title}>
        <Thumbnail alt='' src={thumbnail || PoiThumbnailPlaceholder} />
        <Description>
          <Title>{title}</Title>
          {!!distance && <Distance>{t('distanceKilometre', { distance })}</Distance>}
          {!!category && <Category>{category}</Category>}
        </Description>
      </LinkContainer>
    </ListItemContainer>
  )
}

export default PoiListItem
