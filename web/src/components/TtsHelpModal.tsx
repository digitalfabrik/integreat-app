import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { BookIcon, WarningIcon } from '../assets'
import Modal from './Modal'
import Icon from './base/Icon'

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: black;
`

const ModalContent = styled.div`
  padding: 0 16px 16px 48px;
`

const StyledWarningText = styled.div`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: 12px;
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
    title: 'Ubuntu',
    icon: BookIcon,
    path: 'https://github.com/Elleo/pied?tab=readme-ov-file',
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
]

const HelpModalItem = ({ icon, title, path }: { icon: string; title: string; path: string }) => (
  <div>
    <StyledLink to={path} target='_blank' rel='noreferrer'>
      <Icon src={icon} />
      <StyledText>{title}</StyledText>
    </StyledLink>
  </div>
)

const TtsHelpModal = ({ closeModal }: { closeModal: () => void }): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation('layout')
  return (
    <Modal
      style={{ borderRadius: 5, backgroundColor: theme.colors.ttsPlayerWarningBackground }}
      title={t('languageNotSupported')}
      icon={<StyledWarningIcon src={WarningIcon} />}
      closeModal={closeModal}>
      <ModalContent>
        <StyledWarningText>{t('voiceUnavailableMessage')}</StyledWarningText>
        <StyledList>
          {helpItemsData.map((item, index) => (
            <HelpModalItem key={`guide${index + 1}`} title={item.title} icon={item.icon} path={item.path} />
          ))}
        </StyledList>
      </ModalContent>
    </Modal>
  )
}

export default TtsHelpModal
