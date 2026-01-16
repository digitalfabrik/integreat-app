import React, { ReactElement } from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { CategoryModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import { CategoryThumbnail } from './CategoryListItem'
import Text from './base/Text'

const SubCategoryTitleContainer = styled.View<{ language: string }>`
  flex: 1;
  align-items: center;
  margin: 8px 0;
  flex-direction: ${props => contentDirection(props.language)};
`

type SubCategoryListItemProps = {
  subCategory: CategoryModel
  onItemPress: (item: CategoryModel) => void
  language: string
}

const SubCategoryListItem = ({ subCategory, onItemPress, language }: SubCategoryListItemProps): ReactElement => {
  const theme = useTheme()
  return (
    <TouchableRipple
      borderless
      onPress={() => onItemPress(subCategory)}
      style={{
        marginLeft: 24,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.secondary,
        flexDirection: contentDirection(language),
      }}
      role='link'
      accessibilityLanguage={language}>
      <SubCategoryTitleContainer language={language}>
        {!!subCategory.thumbnail && <CategoryThumbnail language={language} source={subCategory.thumbnail} />}
        <Text variant='caption' style={{ flexShrink: 1 }}>
          {subCategory.title}
        </Text>
      </SubCategoryTitleContainer>
    </TouchableRipple>
  )
}

export default SubCategoryListItem
