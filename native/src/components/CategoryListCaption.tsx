import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const H1 = styled.Text<{
  withThumbnail: boolean
}>`
  padding: ${props => (props.withThumbnail ? '0 0' : '20px 0')};
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
type PropsType = {
  title: string
  withThumbnail: boolean
}

const CategoryListCaption = ({ title, withThumbnail }: PropsType): ReactElement => (
  <H1 withThumbnail={withThumbnail}>{title}</H1>
)

export default CategoryListCaption
