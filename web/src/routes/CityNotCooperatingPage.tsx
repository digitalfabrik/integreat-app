import CopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import Button from '@mui/material/Button'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import GeneralFooter from '../components/GeneralFooter'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'
import { helpers } from '../constants/theme'
import useScrollToTopOnMount from '../hooks/useScrollToTopOnMount'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`

const StyledTypography = styled(Typography)<TypographyProps>`
  text-align: center;
  padding: 20px;
  white-space: pre-line;
`

const Icon = styled('img')`
  width: calc(40px + 10vw);
  height: calc(40px + 10vw);
  flex-shrink: 0;
  align-self: center;
`

const ListHeading = styled(StyledTypography)`
  padding: 0;
`

const ListItem = styled('div')`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`

const StepNumber = styled('div')`
  border-radius: 50%;
  line-height: 2rem;
  min-width: 2rem;
  height: 2rem;
  text-align: center;
  background-color: ${props => props.theme.legacy.colors.themeColor};
  ${helpers.adaptiveThemeTextColor}
  margin-bottom: 6px;
`

const StyledButton = styled(Button)`
  align-self: center;
  z-index: 10;
  margin-top: 40px;
`

const TemplateText = styled(Typography)`
  position: relative;
  direction: ltr;
  top: -30px;
  border: 1px solid ${props => props.theme.legacy.colors.themeColor};
  padding: 50px 30px 30px;
  white-space: pre-line;
`

type CityNotCooperatingPageProps = {
  languageCode: string
}

const CityNotCooperatingPage = ({ languageCode }: CityNotCooperatingPageProps): ReactElement | null => {
  const { t } = useTranslation('cityNotCooperating')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate
  const cityNotCooperatingIcon = buildConfig().icons.cityNotCooperating
  useScrollToTopOnMount()

  if (!template) {
    return null
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(template)
      .then(() => {
        setIsCopied(true)
      })
      .catch(() => setIsCopied(false))
  }

  return (
    <Layout footer={<GeneralFooter language={languageCode} />}>
      <Container>
        <StyledTypography variant='h1'>{t('callToAction')}</StyledTypography>
        <Typography variant='body1'>{t('explanation')}</Typography>
        <Icon alt='' src={cityNotCooperatingIcon} />
        <ListHeading variant='title2' component='h2'>
          {t('whatToDo')}
        </ListHeading>
        <ListItem>
          <StepNumber>1</StepNumber>
          <Typography variant='body1' component='h3'>
            {t('findOutMail')}
          </Typography>
        </ListItem>
        <ListItem>
          <StepNumber>2</StepNumber>
          <Typography variant='body1' component='h3'>
            {t('sendText')}
          </Typography>
        </ListItem>
        <StyledButton onClick={copyToClipboard} startIcon={isCopied ? <DoneIcon /> : <CopyIcon />} variant='contained'>
          {isCopied ? t('common:copied') : t('copyText')}
        </StyledButton>
        <TemplateText variant='body1'>{template}</TemplateText>
      </Container>
    </Layout>
  )
}

export default CityNotCooperatingPage
