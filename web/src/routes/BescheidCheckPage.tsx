import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip, { chipClasses } from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  bescheidCheckName,
  parseQueryParams,
  pathnameFromRouteInformation,
  regionContentPath,
  REGIONS_ROUTE,
} from 'shared'

import BackButton from '../components/BackButton'
import BescheidCheckFileSelection, { SelectedFile } from '../components/BescheidCheckFileSelection'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import Checkbox from '../components/base/Checkbox'
import { DirectionDependentForwardIcon } from '../components/base/DirectionDependentIcons'
import H1 from '../components/base/H1'
import Link from '../components/base/Link'
import buildConfig from '../constants/buildConfig'

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'transparent',
  height: 28,
  paddingInline: 4,

  [`& .${chipClasses.icon}`]: {
    color: theme.palette.primary.main,
  },
}))

const Row = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
})

type BescheidCheckPageProps = {
  languageCode: string
}

const BescheidCheckPage = ({ languageCode }: BescheidCheckPageProps): ReactElement => {
  const [searchParams] = useSearchParams()
  const { region: regionCode } = parseQueryParams(searchParams)
  const [files, setFiles] = useState<SelectedFile[]>([])
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const { t } = useTranslation()

  const fallbackBackTo = regionCode
    ? regionContentPath({ regionCode, languageCode })
    : pathnameFromRouteInformation({ route: REGIONS_ROUTE, languageCode })
  const { privacyUrls } = buildConfig()
  const privacyUrl = privacyUrls[languageCode] ?? privacyUrls.default

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <BackButton fallback={fallbackBackTo} />
      <Row sx={{ flexWrap: 'wrap' }}>
        <H1 sx={{ typography: 'h4' }}>{bescheidCheckName}</H1>
        <StyledChip label={t($ => $.bescheidCheck.beta)} variant='outlined' size='small' />
        <StyledChip
          icon={<AutoAwesomeIcon />}
          label={t($ => $.bescheidCheck.aiSupported)}
          variant='outlined'
          size='small'
        />
      </Row>
      <Stack sx={{ gap: 3 }}>
        <Typography variant='body2'>{t($ => $.bescheidCheck.introduction)}</Typography>
        <Row>
          <InfoOutlinedIcon fontSize='small' />
          <Typography variant='body3'>{t($ => $.bescheidCheck.databaseNote)}</Typography>
        </Row>
        <BescheidCheckFileSelection files={files} setFiles={setFiles} />
        <Stack sx={{ gap: 3, paddingInline: { md: 3 } }}>
          <Button
            variant='contained'
            endIcon={<DirectionDependentForwardIcon />}
            disabled={files.length === 0 || !privacyPolicyAccepted}>
            {t($ => $.bescheidCheck.submit)}
          </Button>
          <Checkbox
            checked={privacyPolicyAccepted}
            setChecked={setPrivacyPolicyAccepted}
            label={
              <Stack component='span' sx={{ gap: 1 }}>
                <Typography variant='body2'>
                  <Trans
                    ns='bescheidCheck'
                    i18nKey={$ => $.bescheidCheck.privacy.confirmation}
                    components={{ Link: <Link to={privacyUrl} highlighted /> }}
                  />
                </Typography>
                <Typography variant='body2'>{t($ => $.bescheidCheck.privacy.description)}</Typography>
              </Stack>
            }
          />
        </Stack>
        <Alert severity='info'>
          <Trans ns='bescheidCheck' i18nKey={$ => $.bescheidCheck.disclaimer} values={{ name: bescheidCheckName }} />
        </Alert>
      </Stack>
    </Layout>
  )
}

export default BescheidCheckPage
