import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Avatar as PaperAvatar, IconButton, overlay, Surface } from 'react-native-paper'
import Animated, { Keyframe } from 'react-native-reanimated'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import useRegionAppContext from '../hooks/useRegionAppContext'
import Icon from './base/Icon'
import Text from './base/Text'

const AVATAR_SIZE = 24
const AVATAR_ICON_SIZE = 22
const APPEAR_DURATION = 200

const appear = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.5 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})

const StyledSurface = styled(Animated.createAnimatedComponent(Surface))`
  max-width: 256px;
  margin-bottom: 16px;
  padding: 16px;
  gap: 8px;
  border-radius: 16px;
  background-color: ${props => overlay(2, props.theme.colors.surface)};
`

const Tail = styled.View`
  position: absolute;
  bottom: -8px;
  right: 16px;
  width: 16px;
  height: 16px;
  background-color: ${props => overlay(2, props.theme.colors.surface)};
  transform: rotate(45deg);
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

const Avatar = styled(PaperAvatar.Icon)`
  background-color: ${props => props.theme.colors.tertiaryDark};
`

const avatarIcon = () => (
  <Icon
    icon={buildConfigAssets().LoadingImage}
    style={{ width: AVATAR_ICON_SIZE, height: AVATAR_ICON_SIZE }}
    overrideFillColors='white'
  />
)

type ChatHighlightPopupProps = {
  chatName: string
}

const ChatHighlightPopup = ({ chatName }: ChatHighlightPopupProps): ReactElement | null => {
  const { t } = useTranslation('chat')
  const { settings, updateSettings } = useRegionAppContext()

  if (settings.chatHighlightPopupVisible) {
    return null
  }

  return (
    <StyledSurface elevation={2} entering={appear.duration(APPEAR_DURATION)}>
      <Header>
        <Avatar size={AVATAR_SIZE} icon={avatarIcon} />
        <Text style={{ flex: 1 }} variant='body2'>
          {t('welcomeGreeting')} 👋
        </Text>
        <IconButton
          icon='close'
          size={16}
          onPress={() => updateSettings({ chatHighlightPopupVisible: true })}
          accessibilityLabel={t('common:close')}
        />
      </Header>
      <Text variant='body2'>
        <Trans
          i18nKey='chat:welcomeText'
          values={{ name: chatName }}
          components={{
            strong: <Text style={{ fontFamily: buildConfig().fonts.native.contentFontBold }}>{chatName}</Text>,
          }}
        />
      </Text>
      <Tail />
    </StyledSurface>
  )
}

export default ChatHighlightPopup
