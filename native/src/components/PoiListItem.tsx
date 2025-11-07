import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Pressable from './base/Pressable'

const Distance = styled.Text`
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  margin-top: 4px;
`
const Category = styled.Text`
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  margin-top: 4px;
`

const StyledPressable = styled(Pressable)<{ language: string }>`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.legacy.colors.textDisabledColor};
  flex-direction: ${props => contentDirection(props.language)};
  padding: 16px 0;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
`

const Description = styled.View`
  flex: 1;
  flex-direction: column;
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  padding: 0 8px;
  justify-content: center;
`

const Title = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  color: ${props => props.theme.legacy.colors.textColor};
`

type PoiListItemProps = {
  poi: PoiModel
  language: string
  navigateToPoi: () => void
  distance: number | null
  onFocus: () => void
}

const PoiListItem = ({ poi, language, navigateToPoi, distance, onFocus }: PoiListItemProps) => {
  const { t } = useTranslation('pois')

  return (
    <StyledPressable onPress={navigateToPoi} language={language} role='link' onFocus={onFocus} focusable>
      <Description>
        <Title>{poi.title}</Title>
        {distance !== null && <Distance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</Distance>}
        <Category>{poi.category.name}</Category>
      </Description>
    </StyledPressable>
  )
}

export default memo(PoiListItem)
