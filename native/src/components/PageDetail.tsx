import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'

const Identifier = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.textColor};
`
const DetailContainer = styled.Text<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.textColor};
`

type PageDetailPropsType = {
  identifier: string
  information: string
  language: string
}

const PageDetail: React.FC<PageDetailPropsType> = (props: PageDetailPropsType): ReactElement => {
  const { identifier, information, language } = props

  return (
    <DetailContainer language={language}>
      <Identifier>{identifier}: </Identifier>
      {information}
    </DetailContainer>
  )
}

export default PageDetail
