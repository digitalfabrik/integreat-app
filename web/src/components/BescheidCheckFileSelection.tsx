import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { bescheidCheckName } from 'shared'

import FileSelection, { SelectedFile } from './FileSelection'
import PrivacyCheckbox from './PrivacyCheckbox'
import { DirectionDependentForwardIcon } from './base/DirectionDependentIcons'

type BescheidCheckFileSelectionProps = {
  languageCode: string
  files: SelectedFile[]
  setFiles: (files: SelectedFile[]) => void
  privacyPolicyAccepted: boolean
  setPrivacyPolicyAccepted: (privacyPolicyAccepted: boolean) => void
}

const BescheidCheckFileSelection = ({
  languageCode,
  files,
  setFiles,
  privacyPolicyAccepted,
  setPrivacyPolicyAccepted,
}: BescheidCheckFileSelectionProps): ReactElement => {
  const { t } = useTranslation()

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography variant='body2'>{t($ => $.bescheidCheck.introduction)}</Typography>
      <FileSelection files={files} setFiles={setFiles} />
      <Stack sx={{ gap: 3, paddingInline: { md: 3 } }}>
        <PrivacyCheckbox
          language={languageCode}
          checked={privacyPolicyAccepted}
          setChecked={setPrivacyPolicyAccepted}
          i18nKey={$ => $.bescheidCheck.privacy}
        />
        <Button
          variant='contained'
          endIcon={<DirectionDependentForwardIcon />}
          disabled={files.length === 0 || !privacyPolicyAccepted}>
          {t($ => $.bescheidCheck.submit)}
        </Button>
      </Stack>
      <Alert severity='info'>
        <Trans ns='bescheidCheck' i18nKey={$ => $.bescheidCheck.disclaimer} values={{ name: bescheidCheckName }} />
      </Alert>
    </Stack>
  )
}

export default BescheidCheckFileSelection
