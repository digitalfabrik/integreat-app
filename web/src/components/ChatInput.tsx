// import AttachFileIcon from '@mui/icons-material/AttachFile'
import shouldForwardProp from '@emotion/is-prop-valid'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import SendIcon from '@mui/icons-material/Send'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import React, { ChangeEvent, KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import Link from './base/Link'

const ICON_FONT_SIZE = { xs: 24, md: 32 }
const INLINE_PADDING = 8

const StyledTextField = styled(TextField, { shouldForwardProp: prop => prop !== 'expanded' })<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    '& .MuiOutlinedInput-root': {
      ...theme.typography.body2,
      borderRadius: 12,
      minHeight: 56,
      alignItems: 'flex-start',
      paddingBlock: 8,
      flexDirection: expanded ? 'column' : 'row',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
      },
    },
  }),
)

const ChatIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.chatIcons.main,
  '&.Mui-focusVisible': { color: theme.palette.chatIcons.focus },
})) as typeof IconButton

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.isContrastTheme ? theme.palette.common.white : theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.isContrastTheme ? 'transparent' : theme.palette.action.disabledBackground,
    color: theme.isContrastTheme ? theme.palette.chatIcons.main : theme.palette.action.disabled,
  },

  [theme.breakpoints.up('md')]: {
    borderRadius: 12,
  },
}))

const ButtonStack = styled(Stack, { shouldForwardProp })<{ expanded: boolean }>(({ theme, expanded }) => ({
  alignItems: 'flex-start',
  gap: 4,
  flexDirection: expanded ? 'row-reverse' : 'row',
  justifyContent: expanded ? 'space-between' : 'flex-end',
  alignSelf: expanded ? 'stretch' : 'flex-end',

  [theme.breakpoints.up('md')]: {
    flexDirection: expanded ? 'column' : 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingInline: expanded ? INLINE_PADDING : 0,
  },
}))

type ChatInputProps = {
  value: string
  setValue: (value: string) => void
  onSubmit: () => void
  region: RegionModel
}

const ChatInput = ({ value, setValue, onSubmit, region }: ChatInputProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [expanded, setExpanded] = useState(false)
  const [expansionLength, setExpansionLength] = useState(0)

  const submitDisabled = value.trim().length === 0

  const submitOnEnter = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }
    event.preventDefault()
    if (!submitDisabled) {
      onSubmit()
    }
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const textarea = event.target
    if (!textarea.value.length) {
      setExpanded(false)
    } else {
      const isMultiline = textarea.scrollHeight - textarea.clientHeight > 1
      if (isMultiline && !expanded) {
        setExpansionLength(textarea.value.length)
        setExpanded(true)
      } else if (expanded && textarea.value.length < expansionLength) {
        setExpanded(false)
      }
    }
    setValue(textarea.value)
  }

  return (
    <StyledTextField
      id='chat-input'
      expanded={expanded}
      value={value}
      onChange={onChange}
      onKeyDown={submitOnEnter}
      multiline
      minRows={1}
      maxRows={5}
      placeholder={t('chatInputHelperText')}
      slotProps={{
        input: {
          endAdornment: (
            <ButtonStack expanded={expanded}>
              <SendButton onClick={onSubmit} disabled={submitDisabled} aria-label={t('sendButton')}>
                <SendIcon sx={{ fontSize: ICON_FONT_SIZE }} />
              </SendButton>
              <Stack direction='row'>
                {/* <ChatIconButton
                  component={Link}
                  to={region.chatPrivacyPolicyUrl ?? buildConfig().privacyUrls.default}
                  aria-label={t('layout:uploadFiles')}
                >
                  <AttachFileIcon sx={{ fontSize: ICON_FONT_SIZE }} />
                </ChatIconButton> */}
                <Tooltip title={t('settings:privacyPolicy')}>
                  <ChatIconButton
                    component={Link}
                    to={region.chatPrivacyPolicyUrl ?? buildConfig().privacyUrls.default}
                    aria-label={t('layout:privacy')}>
                    <PrivacyTipIcon sx={{ fontSize: ICON_FONT_SIZE }} />
                  </ChatIconButton>
                </Tooltip>
              </Stack>
            </ButtonStack>
          ),
        },
      }}
    />
  )
}

export default ChatInput
