import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GeoJsonPoiProperties } from 'api-client'

import PoiPlaceholder from '../assets/PoiPlaceholderThumbnail.jpg'
import CleanLink from './CleanLink'

const ListItemContainer = styled.article`
  font-family: ${props => props.theme.fonts.web.contentFont};
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.textDecorationColor};
  padding: 22px 0;

  &:first-child {
    padding-top: 0;
  }
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: contain;
  border-radius: 10px;
`

const Distance = styled.div`
  font-size: ${props => props.theme.fonts.hintFontSize};
`

export const Description = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 0 22px;
  word-wrap: break-word;

  > * {
    padding-bottom: 10px;
  }
`

const Title = styled.span`
  font-size: ${props => props.theme.fonts.hintFontSize};
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
        <Thumbnail alt='' src={thumbnail || PoiPlaceholder} />
        <Description>
          <Title>{title}</Title>
          {distance && <Distance>{t('distanceKilometre', { distance })}</Distance>}
        </Description>
      </CleanLink>
    </ListItemContainer>
  )
}

export default PoiListItem
