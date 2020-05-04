// @flow

import * as React from 'react'
import { NewsModel } from '@integreat-app/integreat-api-client' // TODO: check if we have newsModel
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { type StyledComponent } from 'styled-components'
import {
  contentDirection,
  contentAlignment
} from '../../../modules/i18n/contentDirection'
import { withTranslation } from 'react-i18next'

const TEXT_MAX_LENGTH = 250

type PropsType = {|
  newsItem: any, // TODO: not sure if there is any NewsItemModel | NewsModel
  language: string,
  navigateToNews: () => void,
  theme: ThemeType
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
  ListItemViewPropsType,
  ThemeType,
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

const Divider = styled.View`
  border-top-width: 0.5px;
  border-top-color: rgba(168, 168, 168, 0.7);
  width: 80%;
  margin-top: 12px;
  margin-bottom: 12px;
  align-self: center;
`

export const Description = styled.View`
  flex-direction: column;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  padding: ${props =>
    props.isTuNews ? '15px 5px 0px 0px' : '0px'};
`

export const Title = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`

export const Content = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 14px;
  letter-spacing: 0.5px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`

export const ReadMore = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${props =>
    props.isTuNews
      ? props.theme.colors.tuNewsColor
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
      isTuNews
    } = this.props
    const newsContent = content || message || ''

    const contentSplitted =
      newsContent.length > TEXT_MAX_LENGTH
        ? `${newsContent.slice(0, TEXT_MAX_LENGTH)}...`
        : newsContent

    return (
      <>
        <Divider />
        <ListItemWrapper>
          <StyledTouchableOpacity onPress={navigateToNews} theme={theme}>
            <Description theme={theme} isTuNews={isTuNews}>
              <ListItemView language={language} theme={theme}>
                <Title theme={theme}>{title}</Title>
              </ListItemView>
              <ListItemView language={language} theme={theme}>
                <Content language={language} theme={theme}>
                  {contentSplitted}
                </Content>
              </ListItemView>
            </Description>
          </StyledTouchableOpacity>
          <ReadMoreWrapper language={language}>
            <ReadMore theme={theme} isTuNews={isTuNews} onPress={navigateToNews}>{`${t(
              'readMore'
            )}`}</ReadMore>
          </ReadMoreWrapper>
        </ListItemWrapper>
      </>
    )
  }
}

const TranslatedNewsListItem = withTranslation('news')(NewsListItem)
export default TranslatedNewsListItem
