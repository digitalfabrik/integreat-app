// @flow

import React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components/native'
import { withTranslation } from 'react-i18next'
import withTheme from '../../modules/theme/hocs/withTheme'
import { LOCAL, TUNEWS } from '../error/hocs/withCustomNewsProvider'
import type { ThemeType } from '../../modules/theme/constants/theme'
import activeInternational from '../../routes/news/assets/tu-news-active.svg'
import inactiveInternational from '../../routes/news/assets/tu-news-inactive.svg'
import type { NewsType } from '../../modules/app/StateType'

const newsTabs = [
  {
    type: LOCAL,
    toggleAttrribute: 'pushNotificationsEnabled'
  },
  {
    type: TUNEWS,
    active: activeInternational,
    inactive: inactiveInternational,
    toggleAttrribute: 'tunewsEnabled'
  }
]

const NewsTypeIcon = styled.Image`
  align-self: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  margin-top: 17px;
  margin-bottom: 5px;
  margin-horizontal: 10px;
`
const LocalTabWrapper: StyledComponent<
  { isSelected: boolean },
  ThemeType,
  *
> = styled.View`
  padding-horizontal: 10px;
  border-radius: 10px;
  height: 34px;
  text-align: center;
  min-width: 110px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isSelected ? props.theme.colors.themeColor : props.theme.colors.inActiveTunewsColor};
`

const LocalText: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.decorativeFontBold}
  color: ${props => props.theme.colors.backgroundColor};
`

const HeaderContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const NewsTypeItem = ({ tab, onItemPress, selectedNewsType, t, theme }) => {
  function onPress () {
    onItemPress(tab.type)
  }
  const isLocal = tab.type === LOCAL
  const isSelected = tab.type === selectedNewsType
  return (
    <TouchableWrapper onPress={onPress}>
      {isLocal ? (
        <LocalTabWrapper isSelected={isSelected} theme={theme}>
          <LocalText theme={theme}>{t(tab.type)}</LocalText>
        </LocalTabWrapper>
      ) : (
        <NewsTypeIcon source={isSelected ? tab.active : tab.inactive} />
      )}
    </TouchableWrapper>
  )
}

const TranslatedNewsTypeItem = withTranslation('news')(
  withTheme()(NewsTypeItem)
)

type PropsType = {|
  cityModel?: CityModel,
  selectedNewsType: NewsType,
  selectAndFetchNews: () => void
|}

const NewsHeader = (props: PropsType) => {
  const { cityModel, selectedNewsType, selectAndFetchNews } = props
  return (
    <HeaderContainer>
      {cityModel && cityModel.pushNotificationsEnabled && (
        <TranslatedNewsTypeItem
          key='pushNotificationsEnabled'
          tab={newsTabs[0]}
          selectedNewsType={selectedNewsType}
          onItemPress={selectAndFetchNews}
        />
      )}
      {cityModel && cityModel.tunewsEnabled && (
        <TranslatedNewsTypeItem
          key='tunewsEnabled'
          tab={newsTabs[1]}
          selectedNewsType={selectedNewsType}
          onItemPress={selectAndFetchNews}
        />
      )}
    </HeaderContainer>
  )
}
export default NewsHeader
