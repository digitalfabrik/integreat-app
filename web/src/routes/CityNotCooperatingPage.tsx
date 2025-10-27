import CopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'
import Svg from '../components/base/Svg'
import buildConfig from '../constants/buildConfig'
import useScrollToTopOnMount from '../hooks/useScrollToTopOnMount'
import { reportError } from '../utils/sentry'

const StyledSvg = styled(Svg)({
  alignSelf: 'center',
})

const StyledButton = styled(Button)(({ theme }) => ({
  alignSelf: 'center',
  zIndex: 1,
  color: theme.palette.background.default,
}))

const TemplateText = styled(Typography)(({ theme }) => ({
  position: 'relative',
  top: -24,
  border: `1px solid ${theme.palette.primary.main}`,
  padding: 32,
  paddingTop: 48,
  whiteSpace: 'pre-line',
}))

type CityNotCooperatingPageProps = {
  languageCode: string
}

const CityNotCooperatingPage = ({ languageCode }: CityNotCooperatingPageProps): ReactElement | null => {
  const { t } = useTranslation('cityNotCooperating')
  const [isCopied, setIsCopied] = useState(false)
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate
  const cityNotCooperatingIcon = buildConfig().icons.cityNotCooperating
  useScrollToTopOnMount()

  if (!template || !cityNotCooperatingIcon) {
    return null
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(template).catch(reportError)
    setIsCopied(true)
  }

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <Stack paddingBlock={4} gap={2}>
        <H1>{t('callToAction')}</H1>
        <Typography variant='body1'>{t('explanation')}</Typography>
        <StyledSvg src={cityNotCooperatingIcon} width={160} height={160} />
        <Typography component='h2' variant='subtitle1'>
          {t('whatToDo')}
        </Typography>
        <Stepper orientation='vertical'>
          <Step active>
            <StepLabel>
              <Typography>{t('findOutMail')}</Typography>
            </StepLabel>
          </Step>
          <Step active>
            <StepLabel>
              <Typography>{t('sendText')}</Typography>
            </StepLabel>
          </Step>
        </Stepper>
        <Stack>
          <StyledButton
            onClick={copyToClipboard}
            startIcon={isCopied ? <DoneIcon /> : <CopyIcon />}
            variant='contained'>
            {isCopied ? t('common:copied') : t('copyText')}
          </StyledButton>
          <TemplateText dir='ltr'>{template}</TemplateText>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default CityNotCooperatingPage
