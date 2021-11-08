import * as React from 'react'
import { TFunction, withTranslation } from 'react-i18next'
import { FlatList, Dimensions, ViewToken } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components/native'

import { IntroRouteType, LANDING_ROUTE } from 'api-client'
import { ThemeType } from 'build-configs'

import SlideContent, { SlideContentType } from '../components/SlideContent'
import SlideFooter from '../components/SlideFooter'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import withTheme from '../hocs/withTheme'
import navigateToDeepLink from '../navigation/navigateToDeepLink'
import { StateType as ReduxStateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import AppSettings from '../utils/AppSettings'
import { reportError } from '../utils/sentry'

const Container = styled.View<{ width: number }>`
  flex: 1;
  flex-direction: column;
  width: ${props => props.width}px;
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
type OwnPropsType = {
  route: RoutePropType<IntroRouteType>
  navigation: NavigationPropType<IntroRouteType>
}
type PropsType = OwnPropsType & {
  t: TFunction
  theme: ThemeType
  language: string
  dispatch: Dispatch<StoreActionType>
}
type StateType = {
  slideCount: number
  currentSlide: number
  width: number
}

class Intro extends React.Component<PropsType, StateType> {
  _appSettings: AppSettings
  _flatList: React.RefObject<FlatList>

  constructor(props: PropsType) {
    super(props)
    this.state = {
      slideCount: this.slides().length,
      currentSlide: 0,
      width: Dimensions.get('window').width
    }
    this._appSettings = new AppSettings()
    this._flatList = React.createRef()
    Dimensions.addEventListener('change', (event: { window: { width: number } }) =>
      this.setState({
        width: event.window.width
      })
    )
  }

  renderAppIcon = () => (): React.ReactNode => <AppIcon source={buildConfigAssets().appIcon} />
  renderImageContent = (image: number) => (): React.ReactNode => <ImageContent source={image} />
  slides = (): Array<SlideContentType> => {
    const icons = buildConfigAssets().intro
    const { t } = this.props

    if (!icons) {
      return [
        {
          key: 'integreat',
          title: t('appName', {
            appName: buildConfig().appName
          }),
          description: t('appDescription', {
            appName: buildConfig().appName
          }),
          renderContent: this.renderAppIcon()
        }
      ]
    }

    return [
      {
        key: 'integreat',
        title: t('appName', {
          appName: buildConfig().appName
        }),
        description: t('appDescription', {
          appName: buildConfig().appName
        }),
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
      await this._appSettings.setIntroShown()

      if (route.params.deepLink) {
        navigateToDeepLink(dispatch, navigation, route.params.deepLink, language)
      } else {
        navigation.replace(LANDING_ROUTE)
      }
    } catch (e) {
      reportError(e)
    }
  }

  goToSlide = (index: number) => {
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }

    this._flatList.current.scrollToIndex({
      index
    })
  }

  renderSlide = ({ item }: { item: SlideContentType }) => {
    const { theme } = this.props
    const { width } = this.state
    return <SlideContent item={item} theme={theme} width={width} />
  }

  onViewableItemsChanged = ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    const viewableItem = viewableItems[0]
    if (viewableItem) {
      if (viewableItem.index !== null) {
        this.setState({
          currentSlide: viewableItem.index
        })
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
          viewabilityConfig={{
            itemVisiblePercentThreshold: 51,
            minimumViewTime: 0.1
          }}
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

const mapStateToProps = (
  state: ReduxStateType
): {
  language: string
} => ({
  language: state.contentLanguage
})

export default connect(mapStateToProps)(withTranslation(['intro', 'settings'])(withTheme<PropsType>(Intro)))
