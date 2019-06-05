// @flow

import * as React from 'react'

import styled from 'styled-components/native'
import type { ThemeType } from 'modules/theme/constants/theme'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'

const SubCategoryCaption = styled(CategoryCaption)`
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const SubCategoryTitle = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontFamilyRegular};
`

type PropsType = {
  subCategory: { title: string, thumbnail: string, path: string },
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void
}

class SubCategoryListItem extends React.PureComponent<PropsType> {
  onSubCategoryPress = () => {
    this.props.onItemPress(this.props.subCategory)
  }

  render () {
    const {subCategory, theme} = this.props
    return (
      <StyledLink onPress={this.onSubCategoryPress}
                  underlayColor={theme.colors.backgroundAccentColor}>
        <SubCategoryCaption search={''} theme={theme}>
          <SubCategoryTitle theme={theme}>{subCategory.title}</SubCategoryTitle>
        </SubCategoryCaption>
      </StyledLink>
    )
  }
}

export default SubCategoryListItem
