import React, { ReactElement } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import Text from './base/Text'

const Container = styled.View<{ width: number }>`
  display: flex;
  justify-content: space-around;
  padding: 32px 16px;
  flex: 1;
  width: ${props => props.width}px;
`

const TextContainer = styled.View`
  padding: 0 24px;
  gap: 10px;
  min-height: 150px;
`

const ContentContainer = styled.View<{ description: boolean }>`
  flex: ${props => (props.description ? 2 : 2 + 1)};
`

export type SlideContentType = {
  key: string
  title: string
  description?: string
  Content: ReactElement
}

type SlideContentProps = {
  item: SlideContentType
  width: number
}

const SlideContent = ({ item, width }: SlideContentProps): ReactElement => (
  <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
    }}>
    <Container width={width}>
      <ContentContainer description={item.description !== undefined}>{item.Content}</ContentContainer>
      {!!item.description && (
        <TextContainer>
          <Text variant='h4' style={{ marginTop: 8 }}>
            {item.title}
          </Text>
          <Text variant='body1'>{item.description}</Text>
        </TextContainer>
      )}
    </Container>
  </ScrollView>
)

export default SlideContent
