import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { Menu, IconButton, useTheme } from 'react-native-paper'

import { SHARE_SIGNAL_NAME } from 'shared'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import MenuAccordion, { withDividers } from './MenuAccordion'

type HeaderMenuProps = {
  visible: boolean
  setVisible: (visible: boolean) => void
  menuItems: React.ReactElement[]
  shareUrl?: string
  pageTitle?: string | null
  onNavigateToDisclaimer?: () => void
  onNavigateToLicenses?: () => void
  renderMenuItem: (title: string, onPress: () => void, icon?: string) => ReactElement
  showDefaultSections?: boolean
}

const COPY_TIMEOUT = 3000

const HeaderMenu = ({
  menuItems = [],
  shareUrl,
  pageTitle,
  onNavigateToDisclaimer,
  onNavigateToLicenses,
  renderMenuItem,
  visible,
  setVisible,
  showDefaultSections = true,
}: HeaderMenuProps): ReactElement => {
  const { languageCode } = useContext(AppContext)
  const [expandedAccordion, setExpandedAccordion] = useState<'share' | 'legal' | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()

  const copyToClipboard = useCallback(() => {
    if (!shareUrl) {
      return
    }
    Clipboard.setString(shareUrl)
    showSnackbar({ text: 'common:copied' })
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), COPY_TIMEOUT)
  }, [shareUrl, showSnackbar])

  const encodedShareUrl = shareUrl ? encodeURIComponent(shareUrl) : ''
  const encodedTitle = encodeURIComponent(pageTitle ?? buildConfig().appName)
  const shareMessage = encodeURIComponent(t('shareMessage', { message: pageTitle ?? buildConfig().appName }))

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}%0a${encodedShareUrl}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}`
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${shareMessage}%0a${encodedShareUrl}`

  const openUrl = async (url: string) => {
    if (shareUrl) {
      sendTrackingSignal({ signal: { name: SHARE_SIGNAL_NAME, url: shareUrl } })
    }
    try {
      await Linking.openURL(url)
    } catch (e) {
      reportError(e)
      showSnackbar({ text: 'generalError' })
    }
  }

  const sharingItems = [
    renderMenuItem('WhatsApp', () => openUrl(whatsappUrl), 'whatsapp'),
    renderMenuItem('Facebook', () => openUrl(facebookUrl), 'facebook'),
    renderMenuItem(t('common:email'), () => openUrl(mailUrl), 'email'),
  ]

  const aboutUrls = buildConfig().aboutUrls
  const privacyUrls = buildConfig().privacyUrls
  const accessibilityUrls = buildConfig().accessibilityUrls
  const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
  const privacyUrl = privacyUrls[languageCode] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[languageCode] ?? accessibilityUrls?.default

  const legalItems = [
    ...(onNavigateToDisclaimer ? [renderMenuItem('disclaimer', () => onNavigateToDisclaimer())] : []),
    renderMenuItem('settings:aboutUs', () => openUrl(aboutUrl)),
    renderMenuItem('privacy', () => openUrl(privacyUrl)),
    ...(accessibilityUrl ? [renderMenuItem('accessibility', () => openUrl(accessibilityUrl))] : []),
    ...(onNavigateToLicenses ? [renderMenuItem('settings:openSourceLicenses', () => onNavigateToLicenses())] : []),
  ]

  const defaultSections =
    showDefaultSections === false
      ? []
      : [
          renderMenuItem(urlCopied ? 'common:copied' : 'layout:copyUrl', () => copyToClipboard(), 'link'),
          <MenuAccordion
            key='share'
            title={t('share')}
            items={sharingItems}
            icon='share-variant'
            expanded={expandedAccordion === 'share'}
            setExpanded={expanded => setExpandedAccordion(expanded ? 'share' : null)}
          />,
          <MenuAccordion
            key='legal'
            title={t('legal')}
            items={legalItems}
            expanded={expandedAccordion === 'legal'}
            setExpanded={expanded => setExpandedAccordion(expanded ? 'legal' : null)}
          />,
        ]

  return (
    <Menu
      key={Number(visible)} // Menu component closes and fails to open again on re-render: https://github.com/callstack/react-native-paper/issues/4763#issuecomment-3427895632
      visible={visible}
      onDismiss={() => setVisible(false)}
      style={{
        width: 232,
      }}
      contentStyle={{
        borderRadius: 16,
        backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
      }}
      anchorPosition='bottom'
      anchor={
        <IconButton
          icon='dots-vertical'
          iconColor={theme.colors.onSurface}
          onPress={() => setVisible(true)}
          testID='header-overflow-menu-button'
        />
      }>
      {withDividers([...menuItems, ...defaultSections])}
    </Menu>
  )
}

export default HeaderMenu
