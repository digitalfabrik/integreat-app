import Clipboard from '@react-native-clipboard/clipboard'
import React, { cloneElement, ReactElement, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton, Menu, useTheme } from 'react-native-paper'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE } from 'shared'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import HeaderMenuItem from './HeaderMenuItem'
import MenuAccordion, { withDividers } from './MenuAccordion'

const COPY_TIMEOUT = 3000

type HeaderMenuProps = {
  navigation: NavigationProps<RoutesType>
  visible: boolean
  setVisible: (visible: boolean) => void
  menuItems: ReactElement[]
  shareUrl?: string
  pageTitle?: string | null
  showDefaultSections?: boolean
}

const HeaderMenu = ({
  navigation,
  menuItems = [],
  shareUrl,
  pageTitle,
  visible,
  setVisible,
  showDefaultSections = true,
}: HeaderMenuProps): ReactElement | null => {
  const { languageCode } = useContext(AppContext)
  const [expandedAccordion, setExpandedAccordion] = useState<'share' | 'legal' | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()

  const closeMenuOnPress = (element: ReactElement<{ onPress?: () => void }>) =>
    element.props.onPress
      ? cloneElement(element, {
          onPress: () => {
            element.props.onPress?.()
            setVisible(false)
          },
        })
      : element

  const openUrl = (url: string) => openExternalUrl(url, showSnackbar)

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

  const sharingItems = [
    <HeaderMenuItem key='whatsapp' title='WhatsApp' onPress={() => openUrl(whatsappUrl)} icon='whatsapp' />,
    <HeaderMenuItem key='facebook' title='Facebook' onPress={() => openUrl(facebookUrl)} icon='facebook' />,
    <HeaderMenuItem key='email' title={t('common:email')} onPress={() => openUrl(mailUrl)} icon='email' />,
  ].map(closeMenuOnPress)

  const aboutUrls = buildConfig().aboutUrls
  const privacyUrls = buildConfig().privacyUrls
  const accessibilityUrls = buildConfig().accessibilityUrls
  const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
  const privacyUrl = privacyUrls[languageCode] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[languageCode] ?? accessibilityUrls?.default

  const legalItems = [
    <HeaderMenuItem key='disclaimer' title={t('disclaimer')} onPress={() => navigation.navigate(DISCLAIMER_ROUTE)} />,
    <HeaderMenuItem key='aboutUs' title={t('settings:aboutUs')} onPress={() => openUrl(aboutUrl)} />,
    <HeaderMenuItem key='privacy' title={t('privacy')} onPress={() => openUrl(privacyUrl)} />,
    ...(accessibilityUrl
      ? [<HeaderMenuItem key='accessibility' title={t('accessibility')} onPress={() => openUrl(accessibilityUrl)} />]
      : []),
    <HeaderMenuItem
      key='licenses'
      title={t('settings:openSourceLicenses')}
      onPress={() => navigation.navigate(LICENSES_ROUTE)}
    />,
  ].map(closeMenuOnPress)

  const defaultSections = showDefaultSections
    ? [
        <HeaderMenuItem
          key='copy'
          title={t(urlCopied ? 'common:copied' : 'layout:copyUrl')}
          onPress={copyToClipboard}
          icon='link'
        />,
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
    : []

  const items = [...menuItems, ...defaultSections].map(closeMenuOnPress)

  if (items.length === 0) {
    return null
  }

  return (
    <Menu
      // Menu component closes and fails to open again on re-render
      // https://github.com/callstack/react-native-paper/issues/4763#issuecomment-3427895632
      key={Number(visible)}
      visible={visible}
      onDismiss={() => setVisible(false)}
      overlayAccessibilityLabel={t('common:close')}
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
          onPress={() => setVisible(!visible)}
          accessibilityLabel={t('settings')}
          testID='header-overflow-menu-button'
        />
      }>
      {withDividers(items)}
    </Menu>
  )
}

export default HeaderMenu
