// @flow

import { withTranslation, type TFunction } from 'react-i18next'
import * as React from 'react'
import type { Dispatch } from 'redux'
import type { ThemeType } from 'build-configs/ThemeType'
import withTheme from '../../modules/theme/hocs/withTheme'
import { FlatList, Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import AppSettings from '../../modules/settings/AppSettings'
import SlideContent, { type SlideContentType } from './SlideContent'
import SlideFooter from './footer/SlideFooter'
import type { ViewToken } from 'react-native/Libraries/Lists/ViewabilityHelper'
import type { StateType as ReduxStateType } from '../../modules/app/StateType'
import { connect } from 'react-redux'
import buildConfig, { buildConfigAssets } from '../../modules/app/constants/buildConfig'
import type { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import { LANDING_ROUTE } from 'api-client/src/routes'
import type { IntroRouteType } from 'api-client/src/routes'
import navigateToDeepLink from '../../modules/navigation/navigateToDeepLink'
import type { StoreActionType } from '../../modules/app/StoreActionType'

const Container: StyledComponent<{| width: number |}, {||}, *> = styled.View`
  flex: 1;
  flex-direction: column;
  width: ${props => props.width}px;
  height: 100%;
  justify-content: space-between;
`

const AppIcon = styled.Image`
  justify-content: center;
  align-self: center;
  flex: 1;
  height: 40%;
  width: 40%;
  resize-mode: contain;
`

const ImageContent = styled.Image`
  justify-content: center;
  align-self: center;
  flex: 1;
  height: 100%;
  width: 60%;
  resize-mode: contain;
`

type OwnPropsType = {|
  route: RoutePropType<IntroRouteType>,
  navigation: NavigationPropType<IntroRouteType>
|}

type PropsType = {|
  ...OwnPropsType,
  t: TFunction,
  theme: ThemeType,
  language: string,
  dispatch: Dispatch<StoreActionType>
|}

type StateType = {|
  slideCount: number,
  currentSlide: number,
  width: number
|}

class Intro extends React.Component<PropsType, StateType> {
  _appSettings: AppSettings
  _flatList: {| current: null | React$ElementRef<typeof FlatList> |}

  constructor(props: PropsType) {
    super(props)
    this.state = {
      slideCount: this.slides().length,
      currentSlide: 0,
      width: Dimensions.get('window').width
    }
    this._appSettings = new AppSettings()
    this._flatList = React.createRef()
    Dimensions.addEventListener('change', (event: {| window: {| width: number |} |}) =>
      this.setState({ width: event.window.width })
    )
  }

  renderAppIcon = () => (): React.Node => <AppIcon source={buildConfigAssets().appIcon} />
  renderImageContent = (image: number) => (): React.Node => <ImageContent source={image} />

  slides = (): Array<SlideContentType> => {
    const icons = buildConfigAssets().intro
    const { t } = this.props

    if (!icons) {
      return [
        {
          key: 'integreat',
          title: t('appName', { appName: buildConfig().appName }),
          description: t('appDescription', { appName: buildConfig().appName }),
          renderContent: this.renderAppIcon()
        }
      ]
    }
    return [
      {
        key: 'integreat',
        title: t('appName', { appName: buildConfig().appName }),
        description: t('appDescription', { appName: buildConfig().appName }),
        renderContent: this.renderAppIcon()
      },
      {
        key: 'search',
        title: t('search'),
        description: t('searchDescription'),
        renderContent: this.renderImageContent(icons.search)
      },
      {
        key: 'events',
        title: t('events'),
        description: t('eventsDescription'),
        renderContent: this.renderImageContent(icons.events)
      },
      {
        key: 'offers',
        title: t('offers'),
        description: t('offersDescription'),
        renderContent: this.renderImageContent(icons.offers)
      },
      {
        key: 'languageChange',
        title: t('languageChange'),
        description: t('languageChangeDescription'),
        renderContent: this.renderImageContent(icons.language)
      }
    ]
  }

  onDone = async () => {
    try {
      const { dispatch, route, navigation, language } = this.props

      if (route.params?.deepLink) {
        navigateToDeepLink(dispatch, navigation, route.params.deepLink, language)
      } else {
        navigation.replace(LANDING_ROUTE)
      }
      await this._appSettings.setIntroShown()
    } catch (e) {
      console.warn(e)
    }
  }

  goToSlide = (index: number) => {
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }
    this._flatList.current.scrollToIndex({ index })
  }

  renderSlide = ({ item }: { item: SlideContentType, ... }) => {
    return <SlideContent item={item} theme={this.props.theme} width={this.state.width} />
  }

  onViewableItemsChanged = ({ viewableItems }: { viewableItems: Array<ViewToken>, ... }) => {
    if (viewableItems.length === 1) {
      if (viewableItems[0].index !== null) {
        this.setState({ currentSlide: viewableItems[0].index })
      }
    }
  }

  render() {
    const { theme, t } = this.props
    const { slideCount, currentSlide, width } = this.state
    return (
      <Container width={width}>
        <FlatList
          ref={this._flatList}
          data={this.slides()}
          horizontal
          pagingEnabled
          viewabilityConfig={{ itemVisiblePercentThreshold: 51, minimumViewTime: 0.1 }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          renderItem={this.renderSlide}
        />
        <SlideFooter
          slideCount={slideCount}
          onDone={this.onDone}
          currentSlide={currentSlide}
          goToSlide={this.goToSlide}
          theme={theme}
          t={t}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state: ReduxStateType): {| language: string |} => ({ language: state.contentLanguage })
type ConnectType = {| ...OwnPropsType, language: string, dispatch: Dispatch<StoreActionType> |}

export default connect<ConnectType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTranslation<$Diff<PropsType, {| theme: ThemeType |}>>(['intro', 'settings'])(withTheme<PropsType>(Intro))
)
