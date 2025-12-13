import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { InternalPathnameParser } from 'shared'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Icon from './base/Icon'
import Text from './base/Text'

const DetailContainer = styled.View<{ widthPadding?: boolean }>`
  flex-direction: row;
  color: ${props => props.theme.colors.onSurface};
  align-items: center;
  padding-inline-start: ${props => (props.widthPadding ? '32px' : '0')};
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.onSurfaceVariant};
  margin-inline-end: 8px;
`

const StyledButton = styled.Pressable`
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
  const theme = useTheme()
  const route = path ? new InternalPathnameParser(path, language, buildConfig().featureFlags.fixedCity).route() : null

  const styles = StyleSheet.create({
    identifier: {
      alignSelf: 'flex-start',
    },
    buttonText: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
      textDecorationColor: theme.colors.primary,
    },
    styledText: {
      color: theme.colors.onSurfaceVariant,
      flexShrink: 1,
    },
  })

  const handlePress = () => {
    if (isExternalUrl && path) {
      openExternalUrl(path, showSnackbar)
    } else {
      navigateTo(route)
    }
  }

  return (
    <DetailContainer widthPadding={!icon && !identifier}>
      {!!identifier && (
        <Text variant='h6' style={styles.identifier}>
          {identifier}:
        </Text>
      )}
      {!!icon && <StyledIcon source={icon} />}
      {route ? (
        <StyledButton accessibilityLabel={accessibilityLabel} onPress={handlePress}>
          <Text variant='body2' style={styles.buttonText}>
            {information}
          </Text>
        </StyledButton>
      ) : (
        <Text variant='body2' style={styles.styledText}>
          {information}
        </Text>
      )}
    </DetailContainer>
  )
}

export default PageDetail
