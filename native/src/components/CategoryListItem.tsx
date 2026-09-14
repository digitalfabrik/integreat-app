import React, { memo, ReactElement, useCallback } from 'react'
import { Divider, List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentAlignmentRTLText, isContentDirectionReversalRequired } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import ContrastImage from './ContrastImage'
import SimpleImage from './SimpleImage'
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
  onItemPress: (item: { path: string }) => void
  language: string
}

const CategoryListItem = ({ language, category, onItemPress }: CategoryListItemProps): ReactElement => {
  const theme = useTheme()
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
      <Divider />
    </>
  )
}
export default memo(CategoryListItem)
