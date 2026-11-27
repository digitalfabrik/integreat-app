import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import {
  BESCHEID_CHECK_ROUTE,
  BescheidCheckProgressStatus,
  bescheidCheckName,
  parseQueryParams,
  pathnameFromRouteInformation,
  regionContentPath,
  REGIONS_ROUTE,
} from 'shared'
import { analyzeBescheid, BescheidCheckResult as AnalysisResult } from 'shared/api'

import BackButton from '../components/BackButton'
import BescheidCheckCounselingProfile from '../components/BescheidCheckCounselingProfile'
import BescheidCheckFileSelection from '../components/BescheidCheckFileSelection'
import BescheidCheckProgress from '../components/BescheidCheckProgress'
import BescheidCheckResult from '../components/BescheidCheckResult'
import { SelectedFile } from '../components/FileSelection'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'
import useDimensions from '../hooks/useDimensions'
import { captureError } from '../utils/sentry'

const ANALYSIS_STATE = 'analysis'

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
  const [status, setStatus] = useState<BescheidCheckProgressStatus | null>(null)
  const [analysisError, setAnalysisError] = useState<Error | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const analysisController = useRef<AbortController | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mobile } = useDimensions()
  const analysisOpen = location.state === ANALYSIS_STATE
  const showAnalysis = analysisOpen && status !== null

  const fallbackBackTo = regionCode
    ? regionContentPath({ regionCode, languageCode })
    : pathnameFromRouteInformation({ route: REGIONS_ROUTE, languageCode })

  useEffect(() => {
    if (!analysisOpen) {
      analysisController.current?.abort()
    }
  }, [analysisOpen])

  const analyze = async () => {
    const controller = new AbortController()
    analysisController.current = controller
    setStatus('uploading')
    setAnalysisError(null)
    setShowResult(false)
    try {
      setResult(
        await analyzeBescheid({
          languageCode,
          regionCode: regionCode ?? BESCHEID_CHECK_ROUTE,
          files: files.map(({ file }) => file),
          onStage: setStatus,
          signal: controller.signal,
        }),
      )
      setStatus('done')
    } catch (error) {
      if (controller.signal.aborted) {
        setStatus(null)
        return
      }
      setAnalysisError(error instanceof Error ? error : new Error())
      await captureError(error)
    }
  }

  const submit = async () => {
    navigate({ search: location.search }, { state: ANALYSIS_STATE })
    await analyze()
  }

  const startNewAnalysis = () => {
    files.forEach(({ url }) => URL.revokeObjectURL(url))
    setFiles([])
    setStatus(null)
    navigate(-1)
  }

  return (
    <Layout
      header={
        <Box sx={{ displayPrint: 'none' }}>
          <GeneralHeader languageCode={languageCode} />
        </Box>
      }
      footer={
        <Box sx={{ displayPrint: 'none' }}>
          <Footer />
        </Box>
      }>
      <Box sx={{ displayPrint: 'none' }}>
        <BackButton key={showAnalysis.toString()} fallback={fallbackBackTo} />
      </Box>
      <Row sx={{ marginBlock: mobile ? 2 : 3, flexWrap: 'wrap' }}>
        <H1 sx={{ typography: 'h4', marginBlock: 0 }}>{bescheidCheckName}</H1>
        <Row sx={{ flexWrap: 'wrap' }}>
          <StyledChip label={t($ => $.common.labels.beta)} variant='outlined' size='small' />
          <StyledChip
            icon={<CheckIcon />}
            label={t($ => $.bescheidCheck.expertExplanations)}
            variant='outlined'
            size='small'
          />
          <StyledChip
            icon={<AutoAwesomeIcon />}
            label={t($ => $.common.labels.aiSupported)}
            variant='outlined'
            size='small'
          />
        </Row>
      </Row>
      {!showAnalysis && (
        <BescheidCheckFileSelection
          languageCode={languageCode}
          files={files}
          setFiles={setFiles}
          privacyPolicyAccepted={privacyPolicyAccepted}
          setPrivacyPolicyAccepted={setPrivacyPolicyAccepted}
          submit={submit}
        />
      )}
      {showAnalysis && !showResult && (
        <Stack sx={{ gap: 6 }}>
          <BescheidCheckProgress
            status={status}
            error={analysisError}
            retry={analyze}
            showResult={() => setShowResult(true)}
            startNewAnalysis={startNewAnalysis}
          />
          <BescheidCheckCounselingProfile regionCode={regionCode} />
        </Stack>
      )}
      {showAnalysis && showResult && result && (
        <BescheidCheckResult result={result} startNewAnalysis={startNewAnalysis} />
      )}
    </Layout>
  )
}

export default BescheidCheckPage
