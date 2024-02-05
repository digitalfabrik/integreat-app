import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import { PageResourceCacheStateType } from '../utils/DataContainer'
import { getCachedThumbnail } from './Categories'
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
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const SubCategoryTitle = styled.Text`
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
      {!!subCategory.thumbnail && (
        <CategoryThumbnail language={language} source={getCachedThumbnail(subCategory.thumbnail, resourceCache)} />
      )}
      <SubCategoryTitle>{subCategory.title}</SubCategoryTitle>
    </SubCategoryTitleContainer>
  </FlexStyledLink>
)

export default SubCategoryListItem
