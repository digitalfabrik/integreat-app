import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PoiFeature } from 'api-client'

import PoiPlaceholder from '../assets/PoiPlaceholderThumbnail.jpg'
import dimensions from '../constants/dimensions'

const ListItemContainer = styled.article`
  font-family: ${props => props.theme.fonts.web.contentFont};
  display: flex;
  padding: clamp(10px, 1vh, 20px) 0;
  border-bottom: 1px solid ${props => props.theme.colors.poiBorderColor};
  cursor: pointer;

  @media screen and ${dimensions.smallViewport} {
    &:last-child {
      border-bottom: none;
    }
  }

  &:first-child {
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
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
`

const Category = styled.div`
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
  color: ${props => props.theme.colors.textSecondaryColor};
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
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
  font-weight: 700;
`

const LinkContainer = styled.div`
  display: flex;
`

type PoiListItemProps = {
  poi: PoiFeature
  selectFeature: (feature: PoiFeature | null, restoreScrollPosition: boolean) => void
}

const PoiListItem = ({ poi, selectFeature }: PoiListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { thumbnail, title, distance, category, slug } = poi.properties

  const onClickItem = () => {
    selectFeature(poi, true)
  }

  return (
    <ListItemContainer id={slug}>
      <LinkContainer onClick={onClickItem} role='button' tabIndex={0} onKeyPress={onClickItem} aria-label={title}>
        <Thumbnail alt='' src={thumbnail || PoiPlaceholder} />
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
