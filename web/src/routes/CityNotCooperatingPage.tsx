import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import GeneralFooter from '../components/GeneralFooter'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'
import useScrollToTopOnMount from '../hooks/useScrollToTopOnMount'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Heading = styled.p`
  font-weight: 600;
  text-align: center;
  font-size: 1.4rem;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  padding: 20px;
  white-space: pre-line;
`

const Text = styled.p`
  font-size: ${props => props.theme.fonts.contentFontSize};
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const Icon = styled.img`
  width: calc(40px + 10vw);
  height: calc(40px + 10vw);
  flex-shrink: 0;
  align-self: center;
`

const ListHeading = styled(Heading)`
  padding: 0;
  font-size: ${props => props.theme.fonts.decorativeFontSize};
`

const ListItem = styled.div`
  display: flex;
  align-items: center;
`

const StepNumber = styled.div`
  border-radius: 50%;
  line-height: 2rem;
  min-width: 2rem;
  height: 2rem;
  text-align: center;
  background-color: ${props => props.theme.colors.themeColor};
`

const StepExplanation = styled(Text)`
  padding: 0 10px;
`

const Button = styled.button`
  background-color: ${props => props.theme.colors.themeColor};
  border: none;
  padding: 8px 25px;
  align-self: center;
  z-index: 10;
  margin-top: 40px;
`

const TemplateText = styled(Text)`
  position: relative;
  direction: ltr;
  top: -30px;
  border: 1px solid ${props => props.theme.colors.themeColor};
  padding: 50px 30px 30px;
  white-space: pre-line;
`

type CityNotCooperatingPageProps = {
  languageCode: string
}

const CityNotCooperatingPage = ({ languageCode }: CityNotCooperatingPageProps): ReactElement => {
  const { t } = useTranslation('cityNotCooperating')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate!
  const cityNotCooperatingIcon = buildConfig().icons.cityNotCooperating
  useScrollToTopOnMount()

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
        <Heading>{t('callToAction')}</Heading>
        <Text>{t('explanation')}</Text>
        <Icon alt='' src={cityNotCooperatingIcon} />
        <ListHeading>{t('whatToDo')}</ListHeading>
        <ListItem>
          <StepNumber>1</StepNumber>
          <StepExplanation>{t('findOutMail')}</StepExplanation>
        </ListItem>
        <ListItem>
          <StepNumber>2</StepNumber>
          <StepExplanation>{t('sendText')}</StepExplanation>
        </ListItem>
        <Button onClick={copyToClipboard}>{isCopied ? t('textCopied') : t('copyText')}</Button>
        <TemplateText>{template}</TemplateText>
      </Container>
    </Layout>
  )
}

export default CityNotCooperatingPage
