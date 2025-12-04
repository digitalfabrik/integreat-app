import React, { ReactElement } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

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

const Heading = styled.Text`
  font-size: 19px;
  color: ${props => props.theme.colors.onSurface};
  font-family: ${props => props.theme.legacy.fonts.native.contentFontBold};
  margin-top: 10px;
`

const ContentContainer = styled.View<{ description: boolean }>`
  flex: ${props => (props.description ? 2 : 2 + 1)};
`

const Description = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.onSurface};
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
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
          <Heading>{item.title}</Heading>
          <Description>{item.description}</Description>
        </TextContainer>
      )}
    </Container>
  </ScrollView>
)

export default SlideContent
