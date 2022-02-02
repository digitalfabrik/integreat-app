import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GeoJsonPoiProperties } from 'api-client'

import PoiPlaceholder from '../assets/POIPlaceholder500x500.jpg'
import CleanLink from './CleanLink'

const ListItemContainer = styled.article`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.textSecondaryColor};
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  padding: 15px 0;
  object-fit: contain;
  border-radius: 10px;
`

const Distance = styled.div`
  font-size: ${props => props.theme.fonts.contentFontSize};
`

export const Description = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 0 15px;
  word-wrap: break-word;

  > * {
    padding-bottom: 10px;
  }
`

const Title = styled.span`
  font-weight: 700;
`

type PropsType = {
  properties: GeoJsonPoiProperties
}

const PoiListItem = ({ properties }: PropsType): ReactElement => {
  const { t } = useTranslation('pois')
  const { path, thumbnail, title, distance } = properties
  return (
    <ListItemContainer>
      <CleanLink to={path}>
        <Thumbnail alt='' src={thumbnail ?? PoiPlaceholder} />
        <Description>
          <Title>{title}</Title>
          {distance && <Distance>{`${distance} ${t('unit')} ${t('distanceText')}`}</Distance>}
        </Description>
      </CleanLink>
    </ListItemContainer>
  )
}

export default PoiListItem
