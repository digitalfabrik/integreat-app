import React, { ReactElement, useContext } from 'react'
import DateFormatterContext from '../contexts/DateFormatterContext'
import styled from 'styled-components/native'
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
}

const CategoryListContent = ({
  content,
  navigateToLink,
  cacheDictionary,
  language,
  lastUpdate,
}: ContentPropsType): ReactElement => {
  const formatter = useContext(DateFormatterContext)
  return (
    <SpaceBetween>
      <Container>
        <NativeHtml
          language={language}
          content={content}
          navigateToLink={navigateToLink}
          cacheDictionary={cacheDictionary}
        />
        {lastUpdate && (
          <LastUpdateContainer>
            <TimeStamp formatter={formatter} lastUpdate={lastUpdate} />
          </LastUpdateContainer>
        )}
      </Container>
    </SpaceBetween>
  )
}

export default CategoryListContent
