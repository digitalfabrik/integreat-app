import React, { memo, ReactElement, useCallback } from 'react'
import { Divider, List as PaperList } from 'react-native-paper'
import styled from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentAlignmentRTLText, isContentDirectionReversalRequired, isRTLText } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import List from './List'
import SimpleImage from './SimpleImage'
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

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
  onItemPress: (item: { path: string }) => void
  language: string
}

const CategoryListItem = ({ language, category, subCategories, onItemPress }: CategoryListItemProps): ReactElement => {
  const renderLeft = useCallback(
    () => (category.thumbnail ? <CategoryThumbnail language={language} source={category.thumbnail} /> : null),
    [category.thumbnail, language],
  )

  return (
    <>
      <PaperList.Item
        titleNumberOfLines={0}
        borderless
        title={
          <Text variant='h6' style={{ textAlign: contentAlignmentRTLText(category.title) }}>
            {category.title}
          </Text>
        }
        role='link'
        containerStyle={{ minHeight: 40 }}
        left={renderLeft}
        onPress={() => onItemPress({ path: category.path })}
        accessibilityLanguage={language}
      />
      {subCategories.length > 0 && (
        <>
          <Divider />
          <List
            items={subCategories}
            style={isRTLText(subCategories[0]?.title ?? category.title) ? { marginRight: 56 } : { marginLeft: 56 }}
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
      )}
    </>
  )
}
export default memo(CategoryListItem)
