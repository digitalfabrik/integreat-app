import React, { ReactElement } from 'react'
import { Pressable, Text } from 'react-native'
import styled from 'styled-components/native'

import { InternalPathnameParser } from 'shared'

import buildConfig from '../constants/buildConfig'
import { contentDirection } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'

const DetailContainer = styled.View<{ language: string }>`
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
  margin-top: 1px;
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline;
  text-decoration-color: ${props => props.theme.colors.linkColor};
`

const StyledText = styled.Text`
  /* Offset for bold sibling */
  margin-top: 2px;
`

type PageDetailProps = {
  identifier: string
  information: string
  language: string
  locationPath?: string | null
}

const PageDetail = ({ identifier, information, language, locationPath }: PageDetailProps): ReactElement => {
  const { navigateTo } = useNavigate()

  if (locationPath) {
    const parsedRoute = new InternalPathnameParser(locationPath, language, buildConfig().featureFlags.fixedCity).route()
    return (
      <DetailContainer language={language}>
        <Identifier>{identifier}: </Identifier>
        <StyledButton onPress={() => navigateTo(parsedRoute)}>
          <ButtonText>{information}</ButtonText>
        </StyledButton>
      </DetailContainer>
    )
  }

  return (
    <DetailContainer language={language}>
      <Identifier>{identifier}: </Identifier>
      <StyledText>{information}</StyledText>
    </DetailContainer>
  )
}

export default PageDetail
