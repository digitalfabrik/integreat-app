import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  bescheidCheckName,
  parseQueryParams,
  pathnameFromRouteInformation,
  regionContentPath,
  REGIONS_ROUTE,
} from 'shared'

import BackButton from '../components/BackButton'
import BescheidCheckFileSelection from '../components/BescheidCheckFileSelection'
import { SelectedFile } from '../components/FileSelection'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'
import useDimensions from '../hooks/useDimensions'

const StyledChip = styled(Chip)(() => ({
  backgroundColor: 'transparent',
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
  const { mobile } = useDimensions()

  const fallbackBackTo = regionCode
    ? regionContentPath({ regionCode, languageCode })
    : pathnameFromRouteInformation({ route: REGIONS_ROUTE, languageCode })

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <BackButton fallback={fallbackBackTo} />
      <Row sx={{ marginBlock: mobile ? 2 : 3, flexWrap: 'wrap' }}>
        <H1 sx={{ typography: 'h4', marginBlock: 0 }}>{bescheidCheckName}</H1>
        <Row>
          <StyledChip label={t($ => $.common.labels.beta)} variant='outlined' size='small' />
          <StyledChip
            icon={<AutoAwesomeIcon />}
            label={t($ => $.common.labels.aiSupported)}
            variant='outlined'
            size='small'
          />
        </Row>
      </Row>
      <BescheidCheckFileSelection
        languageCode={languageCode}
        files={files}
        setFiles={setFiles}
        privacyPolicyAccepted={privacyPolicyAccepted}
        setPrivacyPolicyAccepted={setPrivacyPolicyAccepted}
      />
    </Layout>
  )
}

export default BescheidCheckPage
