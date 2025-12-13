import React, { memo, ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentDirection, isContentDirectionReversalRequired } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import List from './List'
import SimpleImage from './SimpleImage'
import SubCategoryListItem from './SubCategoryListItem'
import Pressable from './base/Pressable'
import Text from './base/Text'

const FlexStyledLink = styled(Pressable)`
  display: flex;
  flex-direction: column;
`
const DirectionContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`

const CategoryEntryContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-self: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secondary};
`

const TitleDirectionContainer = styled.View<{ language: string }>`
  align-items: center;
  flex-direction: ${props => contentDirection(props.language)};
  color: ${props => props.theme.colors.onSurface};
`

export const CategoryThumbnail = styled(SimpleImage)<{ language: string }>`
  align-self: center;
  flex-shrink: 0;
  width: ${dimensions.categoryListItem.iconSize}px;
  height: ${dimensions.categoryListItem.iconSize}px;
  margin-right: ${props =>
    isContentDirectionReversalRequired(props.language) ? 0 : dimensions.categoryListItem.margin}px;
  margin-left: ${props =>
    isContentDirectionReversalRequired(props.language) ? dimensions.categoryListItem.margin : 0}px;
`

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
  onItemPress: (item: { path: string }) => void
  language: string
}

const CategoryListItem = ({ language, category, subCategories, onItemPress }: CategoryListItemProps): ReactElement => {
  const theme = useTheme()
  const styles = StyleSheet.create({
    categoryTitle: {
      flexDirection: contentDirection(language),
      color: theme.colors.onSurface,
      flexShrink: 1,
    },
  })

  return (
    <>
      <FlexStyledLink role='link' onPress={() => onItemPress({ path: category.path })} accessibilityLanguage={language}>
        <DirectionContainer language={language}>
          <CategoryEntryContainer>
            <TitleDirectionContainer language={language}>
              {!!category.thumbnail && <CategoryThumbnail language={language} source={category.thumbnail} />}
              <Text variant='h6' style={styles.categoryTitle}>
                {category.title}
              </Text>
            </TitleDirectionContainer>
          </CategoryEntryContainer>
        </DirectionContainer>
      </FlexStyledLink>
      <List
        items={subCategories}
        renderItem={({ item: subCategory }) => (
          <SubCategoryListItem
            key={subCategory.path}
            subCategory={subCategory}
            onItemPress={onItemPress}
            language={language}
          />
        )}
        scrollEnabled={false}
      />
    </>
  )
}
export default memo(CategoryListItem)
