import React, { memo, ReactElement, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { Divider, List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentAlignment, contentDirection, isContentDirectionReversalRequired } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import ContrastImage from './ContrastImage'
import SimpleImage from './SimpleImage'
import SimpleList from './SimpleList'
import SubCategoryListItem from './SubCategoryListItem'
import Text from './base/Text'

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

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 0,
  },
  content: {
    paddingLeft: 0,
    paddingRight: 16,
  },
})

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
  onItemPress: (item: { path: string }) => void
  language: string
}

const CategoryListItem = ({ language, category, subCategories, onItemPress }: CategoryListItemProps): ReactElement => {
  const theme = useTheme()
  const isReversed = isContentDirectionReversalRequired(language)
  const renderLeft = useCallback(() => {
    if (!category.thumbnail) {
      return null
    }
    const thumbnail = <CategoryThumbnail language={language} source={category.thumbnail} />
    return theme.dark ? <ContrastImage>{thumbnail}</ContrastImage> : thumbnail
  }, [category.thumbnail, theme.dark, language])

  return (
    <>
      <PaperList.Item
        style={isReversed && styles.container}
        contentStyle={isReversed && styles.content}
        titleNumberOfLines={0}
        borderless
        title={
          <Text variant='h6' style={{ textAlign: contentAlignment(language) }}>
            {category.title}
          </Text>
        }
        role='link'
        containerStyle={{ minHeight: 40, flexDirection: contentDirection(language) }}
        left={renderLeft}
        onPress={() => onItemPress({ path: category.path })}
        accessibilityLanguage={language}
      />
      {subCategories.length > 0 && (
        <>
          <Divider />
          <SimpleList
            items={subCategories}
            style={isReversed ? { marginRight: 56 } : { marginLeft: 56 }}
            renderItem={({ item: subCategory }) => (
              <SubCategoryListItem
                key={subCategory.path}
                subCategory={subCategory}
                onItemPress={onItemPress}
                language={language}
              />
            )}
          />
        </>
      )}
    </>
  )
}
export default memo(CategoryListItem)
