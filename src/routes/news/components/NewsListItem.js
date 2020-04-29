// @flow

import * as React from 'react'
import { NewsModel } from '@integreat-app/integreat-api-client' // TODO: check if we have newsModel
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { type StyledComponent } from 'styled-components'
import { contentDirection } from '../../../modules/i18n/contentDirection'
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
const ListItemWrapper = styled.View``

const StyledTouchableOpacity: StyledComponent<
  {},
  ThemeType,
  *
> = styled.TouchableOpacity`
  flex-direction: column;
  padding-bottom: 10px;
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
  padding: 15px 5px 0;
`

export const Title = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 14px;
  margin-bottom: 8px;
  margin-top: 8px;
`

export const Content = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${props => props.theme.colors.textColor};
`

export const ReadMore = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${props => props.theme.colors.tuNewsColor};
`

class NewsListItem extends React.PureComponent<PropsType> {
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */

  render () {
    const {
      newsItem: { title, content = '' },
      language,
      navigateToNews,
      theme,
      t
    } = this.props

    const isContentSplitted = content.length > TEXT_MAX_LENGTH

    const contentSplitted =
      content.length > TEXT_MAX_LENGTH
        ? `${content.slice(0, TEXT_MAX_LENGTH)}...`
        : content

    return (
      <ListItemWrapper>
        <Divider />
        <StyledTouchableOpacity onPress={navigateToNews} theme={theme}>
          <Description theme={theme}>
            <ListItemView language={language} theme={theme}>
              <Title theme={theme}>{title}</Title>
            </ListItemView>
            <ListItemView language={language} theme={theme}>
              <Content theme={theme}>
                {contentSplitted}
                {isContentSplitted && (
                  <ReadMore theme={theme}>{t('readMore')}</ReadMore>
                )}
              </Content>
            </ListItemView>
          </Description>
        </StyledTouchableOpacity>
      </ListItemWrapper>
    )
  }
}

export default withTranslation('news')(NewsListItem)
