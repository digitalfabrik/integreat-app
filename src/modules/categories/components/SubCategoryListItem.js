// @flow

import * as React from 'react'

import styled from 'styled-components/native'
import { Text, View } from 'react-native'
import type { ThemeType } from 'modules/theme/constants/theme'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'

const SubCategoryCaption = styled(CategoryCaption)`
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

type PropsType = {
  subCategory: { id: number, title: string, thumbnail: string, path: string },
  theme: ThemeType,
  onItemPress: (tile: { id: number, title: string, thumbnail: string, path: string }) => void
}

class SubCategoryListItem extends React.PureComponent<PropsType> {
  onSubCategoryPress = () => {
    this.props.onItemPress(this.props.subCategory)
  }

  render () {
    const {subCategory} = this.props
    return (
      <View key={subCategory.id}>
        <StyledLink onPress={this.onSubCategoryPress}
                    underlayColor={this.props.theme.colors.backgroundAccentColor}>
          <SubCategoryCaption search={''}>
            <Text>{subCategory.title}</Text>
          </SubCategoryCaption>
        </StyledLink>
      </View>
    )
  }
}

export default SubCategoryListItem
