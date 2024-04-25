import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import { PageResourceCacheStateType } from '../utils/DataContainer'
import { CategoryThumbnail } from './CategoryListItem'
import Pressable from './base/Pressable'

const FlexStyledLink = styled(Pressable)<{ language: string }>`
  display: flex;
  flex-flow: row nowrap;
  flex-direction: ${props => contentDirection(props.language)};
  margin: 8px 0 8px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const SubCategoryTitleContainer = styled.View<{ language: string }>`
  flex: 1;
  align-items: center;
  flex-direction: ${props => contentDirection(props.language)};
`

const SubCategoryTitle = styled.Text`
  flex: 1;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

type SubCategoryListItemProps = {
  subCategory: CategoryModel
  resourceCache: PageResourceCacheStateType
  onItemPress: (item: CategoryModel) => void
  language: string
}

const SubCategoryListItem = ({
  subCategory,
  resourceCache,
  onItemPress,
  language,
}: SubCategoryListItemProps): ReactElement => (
  <FlexStyledLink onPress={() => onItemPress(subCategory)} language={language}>
    <SubCategoryTitleContainer language={language}>
      <CategoryThumbnail language={language} source={subCategory.thumbnail} resourceCache={resourceCache} />
      <SubCategoryTitle>{subCategory.title}</SubCategoryTitle>
    </SubCategoryTitleContainer>
  </FlexStyledLink>
)

export default SubCategoryListItem
