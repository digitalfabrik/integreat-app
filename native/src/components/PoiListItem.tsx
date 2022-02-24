import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { PoiFeature } from 'api-client'
import { ThemeType } from 'build-configs'

import Placeholder from '../assets/PoiPlaceholderThumbnail.jpg'
import { contentDirection } from '../constants/contentDirection'
import SimpleImage from './SimpleImage'

const Distance = styled.Text`
  color: ${props => props.theme.colors.textColor};
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
  flex-direction: column;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
  flex-direction: ${props => contentDirection(props.language)};
  padding: 24px 0;
`

const Description = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: column;
  flex-grow: 1;
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
  poi: PoiFeature
  language: string
  navigateToPoi: () => void
  theme: ThemeType
}

export const PoiListItem: React.FC<PoiListItemProps> = memo(
  ({ poi, navigateToPoi, language, theme }: PoiListItemProps): ReactElement => {
    const { t } = useTranslation('pois')
    const thumbnail = poi.properties.thumbnail ?? Placeholder
    return (
      <StyledTouchableOpacity onPress={navigateToPoi} theme={theme} activeOpacity={1} language={language}>
        <Thumbnail source={thumbnail} />
        <Description theme={theme}>
          <Title theme={theme}>{poi.properties.title}</Title>
          {poi.properties.distance && (
            <Distance theme={theme}>{t('distanceKilometre', { distance: poi.properties.distance })}</Distance>
          )}
        </Description>
      </StyledTouchableOpacity>
    )
  }
)
