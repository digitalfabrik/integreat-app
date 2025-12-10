import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { InternalPathnameParser } from 'shared'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Icon from './base/Icon'

const DetailContainer = styled.View<{ widthPadding?: boolean }>`
  flex-direction: row;
  color: ${props => props.theme.colors.onSurface};
  align-items: center;
  padding-inline-start: ${props => (props.widthPadding ? '32px' : '0')};
`

const Identifier = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.onSurface};
  align-self: flex-start;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.onSurfaceVariant};
  margin-inline-end: 8px;
`

const StyledButton = styled.Pressable`
  flex-shrink: 1;
`

const ButtonText = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
  text-decoration-color: ${props => props.theme.colors.primary};
`

const StyledText = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.onSurfaceVariant};
  flex-shrink: 1;
`

type PageDetailProps = {
  identifier?: string
  icon?: string
  information: string
  language: string
  path?: string | null
  isExternalUrl?: boolean
  accessibilityLabel?: string | undefined
}

const PageDetail = ({
  identifier,
  icon,
  information,
  language,
  path,
  isExternalUrl,
  accessibilityLabel,
}: PageDetailProps): ReactElement => {
  const { navigateTo } = useNavigate()
  const showSnackbar = useSnackbar()
  const route = path ? new InternalPathnameParser(path, language, buildConfig().featureFlags.fixedCity).route() : null

  const handlePress = () => {
    if (isExternalUrl && path) {
      openExternalUrl(path, showSnackbar)
    } else {
      navigateTo(route)
    }
  }

  return (
    <DetailContainer widthPadding={!icon && !identifier}>
      {!!identifier && <Identifier>{identifier}: </Identifier>}
      {!!icon && <StyledIcon source={icon} />}
      {route ? (
        <StyledButton accessibilityLabel={accessibilityLabel} onPress={handlePress}>
          <ButtonText>{information}</ButtonText>
        </StyledButton>
      ) : (
        <StyledText>{information}</StyledText>
      )}
    </DetailContainer>
  )
}

export default PageDetail
