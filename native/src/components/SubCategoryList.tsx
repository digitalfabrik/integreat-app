import React, { memo, ReactElement } from 'react'
import styled from 'styled-components/native'

import { CategoryModel } from 'api-client'

import { contentDirection, isContentDirectionReversalRequired } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import { getCachedThumbnail } from './Categories'
import List from './List'
import SimpleImage from './SimpleImage'
import SubCategoryListItem from './SubCategoryListItem'
import Pressable from './base/Pressable'

const FlexStyledLink = styled(Pressable)`
  display: flex;
  flex-direction: column;
`
const DirectionContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`

const SubCategoryEntryContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-self: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const TitleDirectionContainer = styled.View<{ language: string }>`
  align-items: center;
  flex-direction: ${props => contentDirection(props.language)};
`

const SubCategoryTitle = styled.Text<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
`

export const SubCategoryThumbnail = styled(SimpleImage)<{ language: string }>`
  align-self: center;
  flex-shrink: 0;
  width: ${dimensions.categoryListItem.iconSize}px;
  height: ${dimensions.categoryListItem.iconSize}px;
  margin-right: ${props =>
    isContentDirectionReversalRequired(props.language) ? 0 : dimensions.categoryListItem.margin}px;
  margin-left: ${props =>
    isContentDirectionReversalRequired(props.language) ? dimensions.categoryListItem.margin : 0}px;
`

type SubCategoryListProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
  resourceCache: LanguageResourceCacheStateType
  onItemPress: (item: { path: string }) => void
  language: string
}

const SubCategoryList = ({
  language,
  category,
  subCategories,
  resourceCache,
  onItemPress,
}: SubCategoryListProps): ReactElement => (
  <>
    <FlexStyledLink onPress={() => onItemPress({ path: category.path })}>
      <DirectionContainer language={language}>
        <SubCategoryEntryContainer>
          <TitleDirectionContainer language={language}>
            {!!category.thumbnail && (
              <SubCategoryThumbnail
                language={language}
                source={getCachedThumbnail(category, resourceCache[category.path] ?? {})}
              />
            )}
            <SubCategoryTitle language={language}>{category.title}</SubCategoryTitle>
          </TitleDirectionContainer>
        </SubCategoryEntryContainer>
      </DirectionContainer>
    </FlexStyledLink>
    <List
      items={subCategories}
      renderItem={({ item: subCategory }) => (
        <SubCategoryListItem
          key={subCategory.path}
          subCategory={subCategory}
          resourceCache={resourceCache[subCategory.path] ?? {}}
          onItemPress={onItemPress}
          language={language}
        />
      )}
      scrollEnabled={false}
    />
  </>
)

export default memo(SubCategoryList)
