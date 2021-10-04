import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { Feature } from 'api-client/node_modules/@types/geojson'
import { ThemeType } from 'build-configs'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import { contentDirection } from '../constants/contentDirection'
import { ListItemViewPropsType } from './ListItem'
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

const ListItemView = styled.View<ListItemViewPropsType>`
  flex: 1;
  flex-direction: ${props => contentDirection(props.language)};
  padding: 24px 0;
`
const StyledTouchableOpacity = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  border-bottom-width: 1px;
  border-bottom-color: #585858;
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
  poi: Feature
  language: string
  navigateToPoi: () => void
  theme: ThemeType
}

const PoiListItem: React.FC<PoiListItemProps> = ({
  poi,
  navigateToPoi,
  language,
  theme
}: PoiListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const thumbnail = poi.properties?.thumbnail ?? EventPlaceholder1
  return (
    <StyledTouchableOpacity onPress={navigateToPoi} theme={theme}>
      <ListItemView language={language} theme={theme}>
        <Thumbnail source={thumbnail} />
        <Description theme={theme}>
          <Title theme={theme}>{poi.properties?.title}</Title>
          {poi.properties?.distance && (
            <Distance theme={theme}>
              {poi.properties.distance} {t('unit')} {t('distanceText')}
            </Distance>
          )}
        </Description>
      </ListItemView>
    </StyledTouchableOpacity>
  )
}
export default PoiListItem
