import React, { PureComponent, ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components/native'

import { PoiFeature } from 'api-client'

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
  poi: PoiFeature
  language: string
  navigateToPoi: () => void
  t: TFunction
}

// This should stay a PureComponent for performance reasons
class PoiListItem extends PureComponent<PoiListItemProps> {
  render(): ReactElement {
    const { poi, language, navigateToPoi, t } = this.props
    const thumbnail = poi.properties.thumbnail ?? Placeholder
    return (
      <StyledTouchableOpacity onPress={navigateToPoi} activeOpacity={1} language={language}>
        <Thumbnail source={thumbnail} />
        <Description>
          <Title>{poi.properties.title}</Title>
          {!!poi.properties.distance && (
            <Distance>{t('distanceKilometre', { distance: poi.properties.distance })}</Distance>
          )}
        </Description>
      </StyledTouchableOpacity>
    )
  }
}

export default PoiListItem
