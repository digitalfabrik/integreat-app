import React, { ReactElement, useContext } from 'react'
import DateFormatterContext from '../contexts/DateFormatterContext'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs/ThemeType'
import { Moment } from 'moment'
import TimeStamp from './TimeStamp'
import SpaceBetween from './SpaceBetween'
import NativeHtml from './NativeHtml'

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
  const formatter = useContext(DateFormatterContext)
  return (
    <SpaceBetween>
      <Container>
        <NativeHtml
          theme={theme}
          language={language}
          content={content}
          navigateToLink={navigateToLink}
          cacheDictionary={cacheDictionary}
        />
        {lastUpdate && (
          <LastUpdateContainer>
            <TimeStamp formatter={formatter} lastUpdate={lastUpdate} theme={theme} />
          </LastUpdateContainer>
        )}
      </Container>
    </SpaceBetween>
  )
}

export default CategoryListContent
