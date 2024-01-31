import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { PoiThumbnailPlaceholder } from '../assets'
import { contentDirection } from '../constants/contentDirection'
import SimpleImage from './SimpleImage'
import Pressable from './base/Pressable'

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

const StyledPressable = styled(Pressable)<{ language: string }>`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textDisabledColor};
  flex-direction: ${props => contentDirection(props.language)};
  padding: 24px 0;
`

const Description = styled.View`
  flex: 1;
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
  poi: PoiModel
  language: string
  navigateToPoi: () => void
  distance: number | null
}

const PoiListItem = ({ poi, language, navigateToPoi, distance }: PoiListItemProps) => {
  const { t } = useTranslation('pois')
  return (
    <StyledPressable onPress={navigateToPoi} language={language}>
      <Thumbnail source={poi.thumbnail || PoiThumbnailPlaceholder} resizeMode='cover' />
      <Description>
        <Title>{poi.title}</Title>
        {distance !== null && <Distance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</Distance>}
        <Category>{poi.category.name}</Category>
      </Description>
    </StyledPressable>
  )
}

export default memo(PoiListItem)
