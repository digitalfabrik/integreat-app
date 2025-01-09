import React, { ReactElement, useCallback, useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, useWindowDimensions, ViewToken } from 'react-native'
import styled, { css } from 'styled-components/native'

import { IntroRouteType, LANDING_ROUTE } from 'shared'

import {
  IntroLanguageIcon,
  IntroNewsIcon,
  IntroOfflineIcon,
  IntroPoisIcon,
  IntroSearchIcon,
  IntroWelcomeIcon,
} from '../assets'
import SlideContent, { SlideContentType } from '../components/SlideContent'
import SlideFooter from '../components/SlideFooter'
import Icon from '../components/base/Icon'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useNavigateToDeepLink from '../hooks/useNavigateToDeepLink'
import { reportError } from '../utils/sentry'

const Container = styled.View<{ width: number }>`
  flex: 1;
  flex-direction: column;
  width: ${props => props.width}px;
  padding-bottom: 30%;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const ImageStyle = css`
  align-self: center;
  flex: 1;
  color: ${props => props.theme.colors.themeColor};
  fill: ${props => props.theme.colors.themeColor};
`

const styledIcons = {
  Welcome: styled(IntroWelcomeIcon)`
    ${ImageStyle};
  `,
  Language: styled(IntroLanguageIcon)`
    ${ImageStyle};
  `,
  Search: styled(IntroSearchIcon)`
    ${ImageStyle};
  `,
  Pois: styled(IntroPoisIcon)`
    ${ImageStyle};
  `,
  News: styled(IntroNewsIcon)`
    ${ImageStyle};
  `,
  Offline: styled(IntroOfflineIcon)`
    ${ImageStyle};
  `,
}

const StyledIcon = styled(Icon)`
  height: 100%;
  width: 80%;
`

type IntroProps = {
  route: RouteProps<IntroRouteType>
  navigation: NavigationProps<IntroRouteType>
}

const Intro = ({ route, navigation }: IntroProps): ReactElement => {
  const { updateSettings } = useContext(AppContext)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { width } = useWindowDimensions()
  const { t } = useTranslation<['intro', 'settings']>(['intro', 'settings'])
  const flatListRef = useRef<FlatList>(null)
  const { deepLink } = route.params
  const navigateToDeepLink = useNavigateToDeepLink()
  const { appName } = buildConfig()

  const slides = [
    {
      key: 'integreat',
      title: t('welcome', { appName }),
      description: t('welcomeDescription', { appName }),
      Content: <StyledIcon Icon={styledIcons.Welcome} />,
    },
    {
      key: 'languageChange',
      title: t('languageChange', { appName }),
      description: t('languageChangeDescription', { appName }),
      Content: <StyledIcon Icon={styledIcons.Language} />,
    },
    {
      key: 'search',
      title: t('search'),
      description: t('searchDescription'),
      Content: <StyledIcon Icon={styledIcons.Search} />,
    },
  ]

  if (buildConfig().featureFlags.pois) {
    slides.push({
      key: 'pois',
      title: t('pois'),
      description: t('poisDescription'),
      Content: <StyledIcon Icon={styledIcons.Pois} />,
    })
  }

  if (buildConfig().featureFlags.newsStream) {
    slides.push({
      key: 'news',
      title: t('newsDescription', { appName }),
      description: t('newsDescription', { appName }),
      Content: <StyledIcon Icon={styledIcons.News} />,
    })
  }

  slides.push({
    key: 'offline',
    title: t('offline'),
    description: t('offlineDescription', {
      appName,
    }),
    Content: <StyledIcon Icon={styledIcons.Offline} />,
  })

  const onDone = useCallback(async () => {
    try {
      updateSettings({ introShown: true })

      if (deepLink) {
        navigateToDeepLink(deepLink)
      } else {
        navigation.replace(LANDING_ROUTE)
      }
    } catch (e) {
      reportError(e)
    }
  }, [navigateToDeepLink, navigation, deepLink, updateSettings])

  const goToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
    })
  }, [])

  const renderSlide = ({ item }: { item: SlideContentType }) => <SlideContent item={item} width={width} />

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const viewableItem = viewableItems[0]
    if (viewableItem) {
      if (viewableItem.index !== null) {
        setCurrentSlide(viewableItem.index)
      }
    }
  }, [])

  return (
    <Container width={width}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        viewabilityConfig={{
          itemVisiblePercentThreshold: 51,

          minimumViewTime: 0.1,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={renderSlide}
      />
      <SlideFooter slideCount={slides.length} onDone={onDone} currentSlide={currentSlide} goToSlide={goToSlide} t={t} />
    </Container>
  )
}

export default Intro
