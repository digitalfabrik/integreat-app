// @flow

import * as React from 'react'

import type { ThemeType } from '../../../modules/theme/constants/theme'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'
import styled, { type StyledComponent } from 'styled-components/native'
import { contentDirection } from '../../i18n/contentDirection'

const SubCategoryCaption = styled(CategoryCaption)`
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const FlexStyledLink: StyledComponent<{}, ThemeType, *> = styled(StyledLink)`
  display: flex;
  flex-direction: column;
`

type DirectionContainerPropsType = {|
  language: string, children: React.Node, theme: ThemeType
|}

const DirectionContainer: StyledComponent<DirectionContainerPropsType, ThemeType, *> = styled.View`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  margin-start: 75px;
`

const SubCategoryTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

type PropsType = {
  subCategory: { title: string, thumbnail: string, path: string },
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void,
  language: string
}

class SubCategoryListItem extends React.PureComponent<PropsType> {
  onSubCategoryPress = () => {
    this.props.onItemPress(this.props.subCategory)
  }

  render () {
    const { language, subCategory, theme } = this.props
    return (
      <FlexStyledLink onPress={this.onSubCategoryPress} underlayColor={theme.colors.backgroundAccentColor}>
        <DirectionContainer theme={theme} language={language}>
          <SubCategoryCaption search={''} theme={theme}>
            <SubCategoryTitle theme={theme}>{subCategory.title}</SubCategoryTitle>
          </SubCategoryCaption>
        </DirectionContainer>
      </FlexStyledLink>
    )
  }
}

export default SubCategoryListItem
