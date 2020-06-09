// @flow

import * as React from 'react'

import { LanguageModel, CityModel } from '@integreat-app/integreat-api-client'
import { RefreshControl, ScrollView, View } from 'react-native'
import type {
  StoreActionType,
  FetchNewsActionType
} from '../../../modules/app/StoreActionType'
import type { NewsType } from '../../../modules/app/StateType'
import { type Dispatch } from 'redux'
import { wrapDisplayName } from 'recompose'
import type { ErrorCodeType } from '../../../modules/error/ErrorCodes'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import LanguageNotAvailableContainer from '../../../modules/common/containers/LanguageNotAvailableContainer'
import styled from 'styled-components/native'
import activeInternational from '../assets/tu-news-active.svg'
import inactiveInternational from '../assets/tu-news-inactive.svg'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { StyledComponent } from 'styled-components'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
export const TUNEWS = 'tunews'
export const LOCAL = 'local'

const newsTabs = [
  {
    type: LOCAL,
    toggleAttr: 'pushNotificationsEnabled'
  },
  {
    type: TUNEWS,
    active: activeInternational,
    inactive: inactiveInternational,
    toggleAttr: 'tunewsEnabled'
  }
]

const NewsTypeIcon = styled.Image`
  align-self: center;
`

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  margin-top: 17px;
  margin-bottom: 5px;
  margin-horizontal: 10px;
`

const Loader = styled.ActivityIndicator`
  margin-top: 15px;
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
    props.isSelected ? props.theme.colors.themeColor : '#959595'};
`

const LocalText: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.decorativeFontBold}
  color: ${props => props.theme.colors.backgroundColor};
`

export type RouteNotInitializedType = {| status: "routeNotInitialized" |}

export type ProviderRefreshPropType = {|
  cityModel?: CityModel,
  navigation: NavigationScreenProp<*>,
  cityCode: string,
  language: LanguageModel
|}

export type LoadingType = {|
  status: "loading",
  innerProps?: {
    newsId: ?string,
    selectedNewsType: NewsType,
    ...ProviderRefreshPropType
  }
|}
export type LoadingMoreType<S: {}> = {| status: "loadingMore", innerProps: S |}

export type ErrorType<R: {}> = {|
  status: "error",
  message: ?string,
  code: ErrorCodeType,
  refreshProps: R | null
|}

export type ProviderPropType = {|
  dispatch: Dispatch<StoreActionType>,
  newsId: ?string,
  selectedNewsType: NewsType,
  ...ProviderRefreshPropType
|}

export type LanguageNotAvailableType = {|
  status: "languageNotAvailable",
  availableLanguages: Array<LanguageModel>,
  changeUnavailableLanguage: (
    dispatch: Dispatch<StoreActionType>,
    newLanguage: string
  ) => void,
  innerProps: {
    newsId?: string,
    selectedNewsType: NewsType,
    ...ProviderRefreshPropType
  }
|}

export type SuccessType<S: {}, R: {}> = {|
  status: "ready",
  innerProps: S,
  refreshProps: R
|}

export type StatusPropsType<S: {}, R: {}> =
  | RouteNotInitializedType
  | LoadingType
  | LoadingMoreType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>>
  | ErrorType<R>
  | LanguageNotAvailableType
  | SuccessType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>, R>

export type PropsType<
  S: {
    ...ProviderPropType
  },
  R: {}
> = {|
  ...StatusPropsType<S, R>,
  ...ProviderPropType
|}

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

const withCustomNewsProvider = <
  S: {
    ...ProviderPropType
  },
  R: {}
>(
    refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void
  ): ((
  Component: React.ComponentType<S>
) => React.ComponentType<PropsType<S, R>>) => {
  return (
    Component: React.ComponentType<S>
  ): React.ComponentType<PropsType<S, R>> => {
    return class extends React.Component<
      PropsType<S, R>,
      {| selectedNewsType: NewsType |}
    > {
      static displayName = wrapDisplayName(Component, 'withCustomNewsProvider');

      state = {
        selectedNewsType: this.getAvailableNewsType()
      };

      listRef = null;

      getAvailableNewsType (): NewsType {
        const { cityModel, selectedNewsType } = this.props.innerProps || {}
        const { tunewsEnabled, pushNotificationsEnabled } = cityModel || {}
        let type = LOCAL
        if (selectedNewsType) {
          type = selectedNewsType
        } else if (tunewsEnabled && !pushNotificationsEnabled) {
          type = TUNEWS
        }
        return type
      }

      selectNewsType = type => {
        this.setState(
          {
            selectedNewsType: type
          },
          this.fetchNews
        )
      };

      selectNewsItemAndScrollToTop = type => {
        this.selectNewsType(type)
      };

      fetchNews = () => {
        const { selectedNewsType } = this.state
        const { dispatch } = this.props
        if (this.props.innerProps) {
          const {
            cityCode,
            navigation,
            newsId,
            language
          } = this.props.innerProps
          const fetchNews: FetchNewsActionType = {
            type: 'FETCH_NEWS',
            params: {
              city: cityCode,
              language,
              newsId,
              type: selectedNewsType,
              key: navigation.state.key,
              criterion: {
                forceUpdate: false,
                shouldRefreshResources: false
              }
            }
          }
          dispatch(fetchNews)
        }
      };

      componentDidUpdate (prevProps: PropsType<S, R>) {
        const prevLanguage = (prevProps.innerProps || {}).language
        const currentLanguage = (this.props.innerProps || {}).language
        if (currentLanguage && prevLanguage !== currentLanguage) {
          this.fetchNews()
        }
      }

      renderHeader = (cityModel: CityModel) => {
        const { selectedNewsType } = this.state
        return (
          <HeaderContainer>
            {newsTabs.map(tab =>
              cityModel[tab.toggleAttr]
               ? <TranslatedNewsTypeItem key={tab.type} tab={tab} selectedNewsType={selectedNewsType} onItemPress={this.selectNewsItemAndScrollToTop} />
               : null
            )}
          </HeaderContainer>
        )
      };

      refresh = () => {
        const props = this.props

        if (
          props.status === 'routeNotInitialized' ||
          props.status === 'loading' ||
          props.status === 'languageNotAvailable'
        ) {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }
        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch)
        }
      };

      changeUnavailableLanguage = (newLanguage: string) => {
        if (this.props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.')
        }
        this.props.changeUnavailableLanguage(this.props.dispatch, newLanguage)
      };

      render () {
        const props = this.props

        if (props.status === 'routeNotInitialized') {
          return null
        } else if (props.status === 'error') {
          return (
            <ScrollView
              refreshControl={<RefreshControl onRefresh={this.refresh} refreshing={false} />}
              contentContainerStyle={{ flexGrow: 1 }}
              >
              <FailureContainer tryAgain={this.refresh} message={props.message} code={props.code} />
            </ScrollView>
          )
        } else if (props.status === 'languageNotAvailable') {
          return (
            <LanguageNotAvailableContainer languages={props.availableLanguages} changeLanguage={this.changeUnavailableLanguage} />
          )
        } else if (props.status === 'loading') {
          return (
            <View style={{ flex: 1 }}>
              {!props.innerProps?.newsId && props.innerProps?.cityModel && this.renderHeader(props.innerProps?.cityModel)}
              <Loader />
            </View>
          )
        } else {
          return (
            <View style={{ flex: 1 }}>
              {!props.innerProps.newsId && this.renderHeader(props.innerProps.cityModel)}
              <Component {...props.innerProps} dispatch={props.dispatch} />
            </View>
          )
        }
      }
    }
  }
}

export default withCustomNewsProvider
