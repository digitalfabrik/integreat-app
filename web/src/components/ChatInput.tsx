// import AttachFileIcon from '@mui/icons-material/AttachFile'
import shouldForwardProp from '@emotion/is-prop-valid'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import SendIcon from '@mui/icons-material/Send'
import { buttonBaseClasses } from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import React, { ChangeEvent, KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const StyledTextField = styled(TextField, { shouldForwardProp: prop => prop !== 'expanded' })<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    [`& .${outlinedInputClasses.root}`]: {
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
  color: theme.palette.text.secondary,
  [`&.${buttonBaseClasses.focusVisible}`]: { color: theme.palette.text.primary },
})) as typeof IconButton

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '& svg': {
    transform: theme.direction === 'rtl' ? 'scaleX(-1)' : undefined,
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },

  [theme.breakpoints.up('md')]: {
    borderRadius: 12,
  },
}))

const ButtonStack = styled(Stack, { shouldForwardProp })<{ expanded: boolean }>(({ theme, expanded }) => ({
  gap: 4,
  flexDirection: expanded ? 'row-reverse' : 'row',
  justifyContent: expanded ? 'space-between' : 'flex-end',
  alignSelf: expanded ? 'stretch' : 'flex-end',

  [theme.breakpoints.up('md')]: {
    flexDirection: expanded ? 'column' : 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingLeft: 8,
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
  const { desktop } = useDimensions()
  const iconFontSize = desktop ? 'large' : 'medium'
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
    const isMultiline = textarea.scrollHeight - textarea.clientHeight > 1
    if (isMultiline && !expanded) {
      setExpansionLength(textarea.value.length)
      setExpanded(true)
    } else if (expanded && textarea.value.length < expansionLength) {
      setExpanded(false)
    }
    setValue(textarea.value)
  }

  const privacyPolicyUrl = region.chatPrivacyPolicyUrl ?? buildConfig().privacyUrls.default

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
                <SendIcon fontSize={iconFontSize} />
              </SendButton>
              <Stack direction='row'>
                {/* <ChatIconButton component={Link} to={privacyPolicyUrl} aria-label={t('layout:uploadFiles')}>
                  <AttachFileIcon fontSize={iconFontSize} />
                </ChatIconButton> */}
                <Tooltip title={t('settings:privacyPolicy')}>
                  <ChatIconButton component={Link} to={privacyPolicyUrl} aria-label={t('layout:privacy')}>
                    <PrivacyTipIcon fontSize={iconFontSize} />
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
