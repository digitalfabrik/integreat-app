import React, { memo } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components/native'

import { GeoJsonPoi } from 'api-client'

import Placeholder from '../assets/PoiPlaceholderThumbnail.jpg'
import { contentDirection } from '../constants/contentDirection'
import SimpleImage from './SimpleImage'

const Distance = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  margin-top: 4px;
`
const Category = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  margin-top: 4px;
`
const Thumbnail = styled(SimpleImage)`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 5px;
`

const StyledTouchableOpacity = styled.TouchableOpacity<{ language: string }>`
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textDisabledColor};
  flex-direction: ${props => contentDirection(props.language)};
  padding: 24px 0;
`

const Description = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: column;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 0 32px;
  justify-content: center;
`
const Title = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
`

type PoiListItemProps = {
  poi: GeoJsonPoi
  language: string
  navigateToPoi: () => void
  t: TFunction
}

const PoiListItem = ({ poi, language, navigateToPoi, t }: PoiListItemProps) => {
  const thumbnail = poi.thumbnail ?? Placeholder
  return (
    <StyledTouchableOpacity onPress={navigateToPoi} activeOpacity={1} language={language}>
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <Description>
        <Title>{poi.title}</Title>
        {!!poi.distance && <Distance>{t('distanceKilometre', { distance: poi.distance })}</Distance>}
        {!!poi.category && <Category>{poi.category}</Category>}
      </Description>
    </StyledTouchableOpacity>
  )
}

export default memo(PoiListItem)
