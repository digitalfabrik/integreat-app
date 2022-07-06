import React, { ReactElement } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

const Container = styled.View<{ width: number }>`
  display: flex;
  justify-content: space-around;
  padding: 32px 16px;
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
  width: ${props => props.width}px;
`
const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
`
const Heading = styled.Text`
  font-size: 35px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
`
const ContentContainer = styled.View<{ description: boolean }>`
  flex: ${props => (props.description ? 2 : 2 + 1)};
`
const Description = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  padding: 0 24px;
  text-align: center;
`
export type SlideContentType = {
  key: string
  title: string
  description?: string
  Content: ReactElement
}
type PropsType = {
  item: SlideContentType
  theme: ThemeType
  width: number
}

const SlideContent = ({ item, theme, width }: PropsType): ReactElement => (
  <ScrollView
    contentContainerStyle={{
      flexGrow: 1
    }}>
    <Container theme={theme} width={width}>
      <TextContainer>
        <Heading theme={theme}>{item.title}</Heading>
      </TextContainer>
      <ContentContainer description={item.description !== undefined}>{item.Content}</ContentContainer>
      {item.description && (
        <TextContainer>
          <Description theme={theme}>{item.description}</Description>
        </TextContainer>
      )}
    </Container>
  </ScrollView>
)

export default SlideContent
