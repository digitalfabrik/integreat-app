import React, { ReactElement } from 'react'
import { Button } from 'react-native'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import { contentDirection } from '../constants/contentDirection'

const Identifier = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.textColor};
`
type DetailContainerPropsType = {
  language: string
  children: React.ReactNode
  theme: ThemeType
}
const DetailContainer = styled.Text<DetailContainerPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.textColor};
`

type PropsType = {
  identifier: string
  information: string
  theme: ThemeType
  language: string
  onLinkClick?: () => void
  linkLabel?: string | null
}

const PageDetail: React.FC<PropsType> = (props: PropsType): ReactElement => {
  const { identifier, information, theme, language, onLinkClick, linkLabel } = props
  return (
    <>
      <DetailContainer theme={theme} language={language}>
        <Identifier theme={theme}>{identifier}: </Identifier>
        {information}
      </DetailContainer>
      {linkLabel && onLinkClick && <Button title={linkLabel} onPress={() => onLinkClick()} />}
    </>
  )
}

export default PageDetail
