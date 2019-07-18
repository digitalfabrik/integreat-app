// @flow

import * as React from 'react'

import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'
import ContentDirectionContainer from '../../i18n/components/ContentDirectionContainer'
import type { ContentDirectionContainerPropsType } from '../../i18n/components/ContentDirectionContainer'

const SubCategoryCaption = styled(CategoryCaption)`
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const StyledContentDirectionContainer: StyledComponent<ContentDirectionContainerPropsType, {||}, *> =
  styled(ContentDirectionContainer)`
  margin-start: 75px;
`

const FlexStyledLink: StyledComponent<{}, {}, *> = styled(StyledLink)`
  display: flex;
  flex-direction: column;
`

const SubCategoryTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

type PropsType = {
  subCategory: { title: string, thumbnail: string, path: string },
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void,
  language: string
}

class SubCategoryListItem extends React.PureComponent<PropsType> {
  onSubCategoryPress = () => {
    this.props.onItemPress(this.props.subCategory)
  }

  render () {
    const { language, subCategory, theme } = this.props
    return (
      <FlexStyledLink onPress={this.onSubCategoryPress}
                      underlayColor={theme.colors.backgroundAccentColor}>
        <StyledContentDirectionContainer theme={theme} language={language}>
          <SubCategoryCaption search={''} theme={theme}>
            <SubCategoryTitle theme={theme}>{subCategory.title}</SubCategoryTitle>
          </SubCategoryCaption>
        </StyledContentDirectionContainer>
      </FlexStyledLink>
    )
  }
}

export default SubCategoryListItem
