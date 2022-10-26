import { Moment } from 'moment'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components/native'

import DateFormatterContext from '../contexts/DateFormatterContext'
import NativeHtml from './NativeHtml'
import SpaceBetween from './SpaceBetween'
import TimeStamp from './TimeStamp'

const HORIZONTAL_MARGIN = 8
const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 0px;
`
const LastUpdateContainer = styled.View`
  margin: 15px 0;
`
type CategoryListContentProps = {
  content: string
  cacheDictionary: Record<string, string>
  language: string
  lastUpdate?: Moment
}

const CategoryListContent = ({
  content,
  cacheDictionary,
  language,
  lastUpdate,
}: CategoryListContentProps): ReactElement => {
  const formatter = useContext(DateFormatterContext)
  return (
    <SpaceBetween>
      <Container>
        <NativeHtml language={language} content={content} cacheDictionary={cacheDictionary} />
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
