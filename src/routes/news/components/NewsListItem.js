// @flow

import * as React from 'react'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import styled from 'styled-components/native'
import { type TFunction, withTranslation } from 'react-i18next'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { type StyledComponent } from 'styled-components'
import {
  contentDirection,
  contentAlignment
} from '../../../modules/i18n/contentDirection'

type PropsType = {|
  newsItem: LocalNewsModel | TunewsModel,
  language: string,
  navigateToNews: () => void,
  theme: ThemeType,
  t: TFunction,
  isTunews: boolean
|}

type ListItemViewPropsType = {|
  language: string,
  children: React.Node,
  theme: ThemeType
|}

const ListItemView: StyledComponent<
  ListItemViewPropsType,
  ThemeType,
  *
> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
`

const ReadMoreWrapper: StyledComponent<
  { language: string, children: React.Node },
  {},
  *
> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: flex-end;
  width: 100%;
`

const ListItemWrapper = styled.View`
  padding-horizontal: 5%;
`

const StyledTouchableOpacity: StyledComponent<
  {},
  ThemeType,
  *
> = styled.TouchableOpacity`
  flex-direction: column;
`

const Divider: StyledComponent<{}, {}, *> = styled.View`
  border-top-width: 0.5px;
  border-top-color: rgba(168, 168, 168, 0.7);
  width: 80%;
  margin-top: 12px;
  margin-bottom: 12px;
  align-self: center;
`

export const Description: StyledComponent<
  { isTunews: ?boolean },
  ThemeType,
  *
> = styled.View`
  flex-direction: column;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  padding: ${props => (props.isTunews ? '15px 5px 0px 0px' : '0px')};
`

export const Title: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`

export const Content: StyledComponent<
  { language: string },
  ThemeType,
  *
> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 14px;
  letter-spacing: 0.5px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`

export const ReadMore: StyledComponent<
  { isTunews: ?boolean },
  ThemeType,
  *
> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  color: ${props =>
    props.isTunews
      ? props.theme.colors.tunewsColor
      : props.theme.colors.themeColor};
`

class NewsListItem extends React.PureComponent<PropsType> {
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */

  render () {
    const {
      newsItem: { title, content, message },
      language,
      navigateToNews,
      theme,
      t,
      isTunews
    } = this.props
    const newsContent = content || message || ''

    return (
      <>
        <Divider />
        <ListItemWrapper>
          <StyledTouchableOpacity onPress={navigateToNews} theme={theme}>
            <Description theme={theme} isTunews={isTunews}>
              <ListItemView language={language} theme={theme}>
                <Title theme={theme}>{title}</Title>
              </ListItemView>
              <ListItemView language={language} theme={theme}>
                <Content numberOfLines={5} language={language} theme={theme}>
                  {newsContent}
                </Content>
              </ListItemView>
            </Description>
          </StyledTouchableOpacity>
          <ReadMoreWrapper language={language}>
            <ReadMore
              theme={theme}
              isTunews={isTunews}
              onPress={navigateToNews}>{`${t('readMore')}`}</ReadMore>
          </ReadMoreWrapper>
        </ListItemWrapper>
      </>
    )
  }
}

const TranslatedNewsListItem = withTranslation('news')(NewsListItem)
export default TranslatedNewsListItem
