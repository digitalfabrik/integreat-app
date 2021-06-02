import React from 'react'
import { CityModel } from 'api-client'
import styled from 'styled-components/native'
import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import { ThemeType } from '../../theme/constants'
import activeInternational from '../../../routes/news/assets/tu-news-active.svg'
import inactiveInternational from '../../../routes/news/assets/tu-news-inactive.svg'
import { TFunction } from 'i18next'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE, NewsType } from 'api-client/src/routes'

const NewsTypeIcon = styled.Image`
  align-self: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  margin-top: 17px;
  margin-bottom: 5px;
  margin-horizontal: 10px;
`
const LocalTabWrapper = styled.View<{ isSelected: boolean }>`
  padding-horizontal: 10px;
  border-radius: 10px;
  height: 34px;
  text-align: center;
  min-width: 110px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isSelected ? props.theme.colors.themeColor : props.theme.colors.textDisabledColor};
`
const LocalText = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  text-transform: uppercase;
  color: ${props => props.theme.colors.backgroundColor};
`
const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
type PropsType = {
  cityModel: CityModel
  selectedNewsType: NewsType
  navigateToNews: (arg0: NewsType) => void
  theme: ThemeType
  t: TFunction
}

class NewsHeader extends React.PureComponent<PropsType> {
  navigateToLocalNews = () => {
    this.props.navigateToNews(LOCAL_NEWS_TYPE)
  }

  navigateToTunews = () => {
    this.props.navigateToNews(TU_NEWS_TYPE)
  }

  render() {
    const { cityModel, selectedNewsType, theme, t } = this.props
    return (
      <HeaderContainer>
        {cityModel.pushNotificationsEnabled ? (
          <TouchableWrapper onPress={this.navigateToLocalNews}>
            <LocalTabWrapper isSelected={selectedNewsType === LOCAL_NEWS_TYPE} theme={theme}>
              <LocalText theme={theme}>{t('local')}</LocalText>
            </LocalTabWrapper>
          </TouchableWrapper>
        ) : null}
        {cityModel.tunewsEnabled ? (
          <TouchableWrapper onPress={this.navigateToTunews}>
            <NewsTypeIcon source={selectedNewsType === TU_NEWS_TYPE ? activeInternational : inactiveInternational} />
          </TouchableWrapper>
        ) : null}
      </HeaderContainer>
    )
  }
}

export default withTranslation('news')(withTheme<PropsType>(NewsHeader))
