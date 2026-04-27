import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import LayoutedScrollView from '../components/LayoutedScrollView'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'

const Container = styled(LayoutedScrollView)`
  padding: 30px;
`

const ListItem = styled.View`
  flex-direction: row;
  margin: 10px 0;
  align-items: center;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  width: 50%;
  height: 20%;
`

const SuggestToRegion = (): ReactElement | null => {
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const { t } = useTranslation('suggestToRegion')
  const theme = useTheme()

  const suggestToRegion = buildConfig().featureFlags.suggestToRegion
  const SuggestToRegionIcon = buildConfigAssets().SuggestToRegionIcon

  const CopyIcon = useCallback(
    () => <Icon color={theme.colors.onPrimary} source={isCopied ? 'check' : 'content-copy'} size={20} />,
    [isCopied, theme.colors.onPrimary],
  )

  const styles = StyleSheet.create({
    heading: {
      padding: 16,
      paddingBottom: 40,
      textAlign: 'center',
    },
    listHeading: {
      alignSelf: 'flex-start',
      padding: 8,
    },
    stepNumber: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.onPrimary,
      lineHeight: 28,
      textAlign: 'center',
      width: 30,
      height: 30,
      borderRadius: 16,
      marginRight: 12,
    },
    stepExplanation: {
      alignSelf: 'center',
      flex: 1,
      paddingBottom: 4,
    },
    templateText: {
      marginTop: -20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      padding: 28,
      paddingTop: 20,
      marginBottom: 252,
    },
    copyButton: {
      width: '40%',
      alignSelf: 'center',
      borderRadius: 4,
      height: 40,
    },
  })

  if (!suggestToRegion) {
    return null
  }

  const copyToClipboard = () => {
    Clipboard.setString(suggestToRegion.template)
    setIsCopied(true)
  }

  return (
    <Container>
      <Text variant='h4' style={styles.heading}>
        {t('callToAction')}
      </Text>

      <Text variant='body1' style={{ color: theme.colors.onSurface }}>
        {t('explanation')}
      </Text>
      {SuggestToRegionIcon && <StyledIcon Icon={SuggestToRegionIcon} />}
      <Text variant='h5' style={styles.listHeading}>
        {t('whatToDo')}
      </Text>
      <ListItem>
        <Text variant='body2' style={styles.stepNumber}>
          1
        </Text>
        <Text variant='body1' style={styles.stepExplanation}>
          {t('findOutMail')}
        </Text>
      </ListItem>
      <ListItem>
        <Text variant='body2' style={styles.stepNumber}>
          2
        </Text>
        <Text variant='body1' style={styles.stepExplanation}>
          {t('sendText')}
        </Text>
      </ListItem>

      <View style={{ zIndex: 1 }}>
        <Button icon={CopyIcon} style={styles.copyButton} mode='contained' onPress={copyToClipboard}>
          {isCopied ? t('common:copied') : t('copyText')}
        </Button>
      </View>
      <Text variant='body2' style={styles.templateText}>
        {suggestToRegion.template}
      </Text>
    </Container>
  )
}

export default SuggestToRegion
