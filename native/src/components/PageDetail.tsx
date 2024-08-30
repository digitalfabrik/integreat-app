import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { InternalPathnameParser } from 'shared'

import buildConfig from '../constants/buildConfig'
import { contentDirection } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'

const DetailContainer = styled.Text<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.textColor};
`

const Identifier = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.textColor};
`

const StyledButton = styled.Pressable`
  /* Offset for bold sibling + underline */
  margin-top: -2px;
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline;
  text-decoration-color: ${props => props.theme.colors.linkColor};
`

type PageDetailProps = {
  identifier: string
  information: string
  language: string
  path?: string | null
}

const PageDetail = ({ identifier, information, language, path }: PageDetailProps): ReactElement => {
  const { navigateTo } = useNavigate()
  const route = path ? new InternalPathnameParser(path, language, buildConfig().featureFlags.fixedCity).route() : null

  return (
    <DetailContainer language={language}>
      <Identifier>{identifier}: </Identifier>
      {route ? (
        <StyledButton onPress={() => navigateTo(route)}>
          <ButtonText>{information}</ButtonText>
        </StyledButton>
      ) : (
        information
      )}
    </DetailContainer>
  )
}

export default PageDetail
