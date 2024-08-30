import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { InternalPathnameParser } from 'shared'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'

const DetailContainer = styled.View<{ language: string }>`
  flex-direction: row;
  color: ${props => props.theme.colors.textColor};
  align-items: center;
`

const Identifier = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.textColor};
  align-self: flex-start;
`

const StyledButton = styled.Pressable`
  flex-shrink: 1;
`

const ButtonText = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline;
  text-decoration-color: ${props => props.theme.colors.linkColor};
`

const StyledText = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  flex-shrink: 1;
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
        <StyledText>{information}</StyledText>
      )}
    </DetailContainer>
  )
}

export default PageDetail
