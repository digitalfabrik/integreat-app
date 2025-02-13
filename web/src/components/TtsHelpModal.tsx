import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { BookIcon, ExternalLinkIcon, WarningIcon } from '../assets'
import Modal from './Modal'
import Icon from './base/Icon'
import Link from './base/Link'

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: black;
`

const ModalContent = styled.div`
  padding: ${props => (props.theme.contentDirection === 'rtl' ? '0 48px 16px 16px' : '0 16px 16px 48px')};
`

const StyledWarningText = styled.div`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: 16px;
  width: 72%;
  margin: 12px 0;
`

const StyledText = styled.span`
  font-weight: bold;
`

const StyledWarningIcon = styled(Icon)`
  color: ${props => props.theme.colors.ttsPlayerWarningColor};
`

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StyledExternalIcon = styled(Icon)`
  height: 12px;
  width: 12px;
`
const helpItemsData = [
  {
    title: 'Windows',
    icon: BookIcon,
    path: 'https://support.microsoft.com/en-us/topic/download-languages-and-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130',
  },
  {
    title: 'MacOS',
    icon: BookIcon,
    path: 'https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac',
  },
  {
    title: 'Android',
    icon: BookIcon,
    path: 'https://support.google.com/accessibility/android/answer/6006983?hl=en&sjid=9301509494880612166-EU',
  },
  {
    title: 'iOS',
    icon: BookIcon,
    path: 'https://support.apple.com/en-us/HT202362',
  },
  {
    title: 'Linux',
    icon: BookIcon,
    path: 'https://github.com/Elleo/pied?tab=readme-ov-file',
  },
]

const HelpModalItem = ({ icon, title, path }: { icon: string; title: string; path: string }) => (
  <div>
    <StyledLink to={path}>
      <Icon src={icon} />
      <StyledText>{title}</StyledText>
      <StyledExternalIcon src={ExternalLinkIcon} />
    </StyledLink>
  </div>
)

const TtsHelpModal = ({ closeModal }: { closeModal: () => void }): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation('layout')
  return (
    <Modal
      contentStyle={{ borderRadius: 5, backgroundColor: theme.colors.ttsPlayerWarningBackground }}
      title={t('voiceUnavailable')}
      icon={<StyledWarningIcon src={WarningIcon} />}
      closeModal={closeModal}>
      <ModalContent>
        <StyledWarningText>{t('voiceUnavailableMessage')}</StyledWarningText>
        <StyledList>
          {helpItemsData.map(item => (
            <HelpModalItem key={item.title} title={item.title} icon={item.icon} path={item.path} />
          ))}
        </StyledList>
      </ModalContent>
    </Modal>
  )
}

export default TtsHelpModal
