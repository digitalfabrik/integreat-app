import * as React from 'react'
import styled from 'styled-components/native'
import { StyledComponent } from 'styled-components'
import 'styled-components'
import { ThemeType } from '../../modules/theme/constants'
import { ScrollView } from 'react-native'
const Container: StyledComponent<
  {
    width: number
  },
  ThemeType,
  any
> = styled.View`
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
const Heading: StyledComponent<{}, ThemeType, any> = styled.Text`
  font-size: 35px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
`
const ContentContainer: StyledComponent<
  {
    description: boolean
  },
  ThemeType,
  any
> = styled.View`
  flex: ${props => (props.description ? 2 : 2 + 1)};
`
const Description: StyledComponent<{}, ThemeType, any> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  padding: 0 24px;
  text-align: center;
`
export type SlideContentType = {
  key: string
  title: string
  description?: string
  renderContent: () => React.ReactNode
}
type PropsType = {
  item: SlideContentType
  theme: ThemeType
  width: number
}

class SlideContent extends React.Component<PropsType> {
  render() {
    const { width, theme, item } = this.props
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}>
        <Container theme={theme} width={width}>
          <TextContainer>
            <Heading theme={theme}>{item.title}</Heading>
          </TextContainer>
          <ContentContainer description={item.description !== undefined}>{item.renderContent()}</ContentContainer>
          {item.description && (
            <TextContainer>
              <Description theme={theme}>{item.description}</Description>
            </TextContainer>
          )}
        </Container>
      </ScrollView>
    )
  }
}

export default SlideContent
