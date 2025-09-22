import React, { ReactElement } from 'react'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { InternalPathnameParser } from 'shared'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import Icon from './base/Icon'

const DetailContainer = styled.View<{ widthPadding?: boolean }>`
  flex-direction: row;
  color: ${props => props.theme.colors.textColor};
  align-items: center;
  padding-inline-start: ${props => (props.widthPadding ? '32px' : '0')};
`

const Identifier = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.textColor};
  align-self: flex-start;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  margin-inline-end: 8px;
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
  identifier?: string
  Icon?: React.JSXElementConstructor<SvgProps>
  information: string
  language: string
  path?: string | null
}

const PageDetail = ({ identifier, Icon, information, language, path }: PageDetailProps): ReactElement => {
  const { navigateTo } = useNavigate()
  const route = path ? new InternalPathnameParser(path, language, buildConfig().featureFlags.fixedCity).route() : null

  return (
    <DetailContainer widthPadding={!Icon && !identifier}>
      {!!identifier && <Identifier>{identifier}: </Identifier>}
      {!!Icon && <StyledIcon Icon={Icon} />}
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
