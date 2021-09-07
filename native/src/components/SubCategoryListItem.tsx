import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import { contentDirection } from '../constants/contentDirection'
import { CategoryListModelType } from './CategoryList'

const SubCategoryTitleContainer = styled.View<{ language: string }>`
  flex: 1;
  align-self: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  flex-direction: ${props => contentDirection(props.language)};
`

const FlexStyledLink = styled.TouchableHighlight<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  margin: 0 20px 0 95px;
`
const SubCategoryTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`
type PropsType = {
  subCategory: CategoryListModelType
  theme: ThemeType
  onItemPress: (tile: CategoryListModelType) => void
  language: string
}

class SubCategoryListItem extends React.PureComponent<PropsType> {
  onSubCategoryPress = (): void => {
    this.props.onItemPress(this.props.subCategory)
  }

  render(): ReactNode {
    const { language, subCategory, theme } = this.props
    return (
      <FlexStyledLink
        onPress={this.onSubCategoryPress}
        underlayColor={theme.colors.backgroundAccentColor}
        language={language}
        theme={theme}>
        <SubCategoryTitleContainer language={language} theme={theme}>
          <SubCategoryTitle theme={theme}>{subCategory.title}</SubCategoryTitle>
        </SubCategoryTitleContainer>
      </FlexStyledLink>
    )
  }
}

export default SubCategoryListItem
