import React, { ReactElement } from 'react'
import { List as PaperList } from 'react-native-paper'

import { CategoryModel } from 'shared/api'

import { contentAlignmentRTLText } from '../constants/contentDirection'
import Text from './base/Text'

type SubCategoryListItemProps = {
  subCategory: CategoryModel
  onItemPress: (item: CategoryModel) => void
  language: string
}

const SubCategoryListItem = ({ subCategory, onItemPress, language }: SubCategoryListItemProps): ReactElement => (
  <PaperList.Item
    titleNumberOfLines={0}
    containerStyle={{ minHeight: 40 }}
    title={
      <Text variant='body2' style={{ flexShrink: 1, textAlign: contentAlignmentRTLText(subCategory.title) }}>
        {subCategory.title}
      </Text>
    }
    borderless
    onPress={() => onItemPress(subCategory)}
    role='link'
    accessibilityLanguage={language}
  />
)
export default SubCategoryListItem
