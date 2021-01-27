// @flow

import React from 'react'
import { CityModel } from 'api-client'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components/native'
import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import type { ThemeType } from '../../theme/constants'
import type { NewsType } from '../../app/StateType'
import { LOCAL_NEWS, TUNEWS } from '../../endpoint/constants'
import activeInternational from '../../../routes/news/assets/tu-news-active.svg'
import inactiveInternational from '../../../routes/news/assets/tu-news-inactive.svg'
import { TFunction } from 'i18next'
import FastImage from 'react-native-fast-image'

const NewsTypeIcon = styled(FastImage)`
  align-self: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  margin-top: 17px;
  margin-bottom: 5px;
  margin-horizontal: 10px;
`
const LocalTabWrapper: StyledComponent<{| isSelected: boolean |}, ThemeType, *> = styled.View`
  padding-horizontal: 10px;
  border-radius: 10px;
  height: 34px;
  text-align: center;
  min-width: 110px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.isSelected
  ? props.theme.colors.themeColor
  : props.theme.colors.textDisabledColor};
`

const LocalText: StyledComponent<{||}, ThemeType, *> = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  text-transform: uppercase;
  color: ${props => props.theme.colors.backgroundColor};
`

const HeaderContainer: StyledComponent<{||}, ThemeType, *> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

type PropsType = {|
  cityModel: CityModel,
  selectedNewsType: NewsType,
  navigateToNews: NewsType => void,
  theme: ThemeType,
  t: TFunction
|}

class NewsHeader extends React.PureComponent<PropsType> {
  navigateToLocalNews = () => { this.props.navigateToNews(LOCAL_NEWS) }
  navigateToTunews = () => { this.props.navigateToNews(TUNEWS) }

  render () {
    const { cityModel, selectedNewsType, theme, t } = this.props

    return (
      <HeaderContainer>
        {cityModel.pushNotificationsEnabled
          ? (
            <TouchableWrapper onPress={this.navigateToLocalNews}>
              <LocalTabWrapper isSelected={selectedNewsType === LOCAL_NEWS} theme={theme}>
                <LocalText theme={theme}>{t('local')}</LocalText>
              </LocalTabWrapper>
            </TouchableWrapper>
            )
          : null}
        {cityModel.tunewsEnabled
          ? (
            <TouchableWrapper onPress={this.navigateToTunews}>
              <NewsTypeIcon source={selectedNewsType === TUNEWS ? activeInternational : inactiveInternational} />
            </TouchableWrapper>
            )
          : null}
      </HeaderContainer>
    )
  }
}

export default withTranslation('news')(
  withTheme(NewsHeader)
)
