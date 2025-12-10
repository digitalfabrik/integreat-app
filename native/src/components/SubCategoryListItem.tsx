import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import { CategoryThumbnail } from './CategoryListItem'
import Pressable from './base/Pressable'

const SubCategoryTitleContainer = styled.View<{ language: string }>`
  flex: 1;
  align-items: center;
  margin: 8px 0;
  flex-direction: ${props => contentDirection(props.language)};
`

const FlexStyledLink = styled(Pressable)<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  margin: 0 0 0 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secondary};
`

const SubCategoryTitle = styled.Text`
  color: ${props => props.theme.colors.onSurface};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  flex-shrink: 1;
`

type SubCategoryListItemProps = {
  subCategory: CategoryModel
  onItemPress: (item: CategoryModel) => void
  language: string
}

const SubCategoryListItem = ({ subCategory, onItemPress, language }: SubCategoryListItemProps): ReactElement => (
  <FlexStyledLink
    onPress={() => onItemPress(subCategory)}
    language={language}
    role='link'
    accessibilityLanguage={language}>
    <SubCategoryTitleContainer language={language}>
      {!!subCategory.thumbnail && <CategoryThumbnail language={language} source={subCategory.thumbnail} />}
      <SubCategoryTitle>{subCategory.title}</SubCategoryTitle>
    </SubCategoryTitleContainer>
  </FlexStyledLink>
)

export default SubCategoryListItem
