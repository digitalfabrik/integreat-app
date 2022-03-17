import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { locationName, PoiFeature } from 'api-client'

import PoiPlaceholder from '../assets/PoiPlaceholderThumbnail.jpg'
import updateQueryParams from '../utils/updateQueryParams'

const ListItemContainer = styled.article`
  font-family: ${props => props.theme.fonts.web.contentFont};
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.poiBorderColor};
  padding: clamp(10px, 1vh, 20px) 0;
  cursor: pointer;

  &:first-child {
    padding-top: 0;
  }
`

const Thumbnail = styled.img`
  width: clamp(70px, 10vh, 100px);
  height: clamp(70px, 10vh, 100px);
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: contain;
  border-radius: 10px;
`

const Distance = styled.div`
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

export const Description = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 0 22px;
  align-self: center;
  word-wrap: break-word;
`

const Title = styled.span`
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
  font-weight: 700;
`

const LinkContainer = styled.div`
  display: flex;
`

type PropsType = {
  poi: PoiFeature
  selectFeature: (feature: PoiFeature | null) => void
  queryParams: URLSearchParams
}

const PoiListItem = ({ poi, selectFeature, queryParams }: PropsType): ReactElement => {
  const { t } = useTranslation('pois')
  const { thumbnail, title, distance } = poi.properties

  const onClickItem = () => {
    selectFeature(poi)
    queryParams.set(locationName, poi.properties.urlSlug)
    updateQueryParams(queryParams)
  }
  return (
    <ListItemContainer>
      <LinkContainer onClick={onClickItem} role='button' tabIndex={0} onKeyPress={onClickItem}>
        <Thumbnail alt='' src={thumbnail || PoiPlaceholder} />
        <Description>
          <Title>{title}</Title>
          {distance && <Distance>{t('distanceKilometre', { distance })}</Distance>}
        </Description>
      </LinkContainer>
    </ListItemContainer>
  )
}

export default PoiListItem
