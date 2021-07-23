import * as React from 'react'
import { ReactElement, useCallback, useContext } from 'react'
import { GestureResponderEvent, useWindowDimensions } from 'react-native'
import Html, { Element } from 'react-native-render-html'
import DateFormatterContext from '../contexts/DateFormatterContext'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs/ThemeType'
import { Moment } from 'moment'
import { config } from 'translations'
import TimeStamp from './TimeStamp'
import SpaceBetween from './SpaceBetween'
import { contentAlignment } from '../constants/contentDirection'

const HORIZONTAL_MARGIN = 8
const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 0px;
`
const LastUpdateContainer = styled.View`
  margin: 15px 0;
`
type ContentPropsType = {
  content: string
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  cacheDictionary: Record<string, string>
  language: string
  lastUpdate?: Moment
  theme: ThemeType
}

const CategoryListContent = ({
  content,
  navigateToLink,
  cacheDictionary,
  language,
  lastUpdate,
  theme
}: ContentPropsType): ReactElement => {
  const width = useWindowDimensions().width
  const formatter = useContext(DateFormatterContext)
  const onLinkPress = useCallback(
    (evt: GestureResponderEvent, url: string) => {
      const shareUrl = Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
      navigateToLink(url, language, shareUrl || url)
    },
    [cacheDictionary, navigateToLink, language]
  )
  const onElement = useCallback(
    (element: Element) => {
      if (element.attribs) {
        const newHref = element.attribs.href && cacheDictionary[decodeURI(element.attribs.href)]
        const newSrc = element.attribs.src && cacheDictionary[decodeURI(element.attribs.src)]
        if (newHref || newSrc) {
          element.attribs = {
            ...element.attribs,
            ...(newHref && { href: newHref }),
            ...(newSrc && { src: newSrc })
          }
        }
      }
    },
    [cacheDictionary]
  )

  return (
    <SpaceBetween>
      <Container>
        <Html
          source={{
            html: content
          }}
          contentWidth={width}
          defaultTextProps={{
            selectable: true
          }}
          domVisitors={{onElement}}
          renderersProps={{
            a: { onPress: onLinkPress },
            ol: { enableExperimentalRtl: true },
            ul: { enableExperimentalRtl: true }
          }}
          baseStyle={{
            fontSize: 14,
            fontFamily: theme.fonts.native.contentFontRegular,
            color: theme.colors.textColor
          }}
          tagsStyles={{
            ul: { direction: config.hasRTLScript(language) ? 'rtl' : 'ltr' },
            ol: { direction: config.hasRTLScript(language) ? 'rtl' : 'ltr' },
            p: { textAlign: contentAlignment(language) }
          }}
        />
        {lastUpdate && (
          <LastUpdateContainer>
            <TimeStamp formatter={formatter} lastUpdate={lastUpdate} language={language} theme={theme} />
          </LastUpdateContainer>
        )}
      </Container>
    </SpaceBetween>
  )
}

export default CategoryListContent
