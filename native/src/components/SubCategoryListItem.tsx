import React, { ReactElement } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'
import { SimpleItem } from './CategoryList'

const SubCategoryTitleContainer = styled.View<{ language: string }>`
  flex: 1;
  align-self: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  flex-direction: ${props => contentDirection(props.language)};
`

const FlexStyledLink = styled.TouchableHighlight<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  margin: 0 20px 0 95px;
`

const SubCategoryTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

type PropsType = {
  subCategory: SimpleItem
  onItemPress: (item: SimpleItem) => void
  language: string
}

const SubCategoryListItem = ({ subCategory, onItemPress, language }: PropsType): ReactElement => {
  const theme = useTheme()

  return (
    <FlexStyledLink
      onPress={() => onItemPress(subCategory)}
      underlayColor={theme.colors.backgroundAccentColor}
      language={language}
      theme={theme}>
      <SubCategoryTitleContainer language={language} theme={theme}>
        <SubCategoryTitle theme={theme}>{subCategory.title}</SubCategoryTitle>
      </SubCategoryTitleContainer>
    </FlexStyledLink>
  )
}

export default SubCategoryListItem
