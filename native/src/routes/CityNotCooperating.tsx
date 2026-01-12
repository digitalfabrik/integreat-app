import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Icon from '../components/base/Icon'
import TextButton from '../components/base/TextButton'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'

const Container = styled.ScrollView`
  flex: 1;
  padding: 30px;
  background-color: ${props => props.theme.colors.background};
`

const Heading = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  font-size: 18px;
  padding: 20px 20px 40px;
  text-align: center;
  color: ${props => props.theme.colors.onSurface};
`

const Description = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.onSurface};
`

const ListHeading = styled(Heading)`
  align-self: flex-start;
  font-size: 15px;
  padding: 10px 0;
`

const ListItem = styled.View`
  flex-direction: row;
  margin: 10px 0;
  align-items: center;
`

const StepNumber = styled.Text`
  background-color: ${props => props.theme.colors.secondary};
  font-size: 15px;
  line-height: 28px;
  text-align: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 10px;
`

const StepExplanation = styled.Text`
  align-self: center;
  flex-shrink: 1;
  padding-bottom: 4px;
  color: ${props => props.theme.colors.onSurface};
`

const StyledButton = styled(TextButton)`
  z-index: 1;
  margin: 15px auto 0;
  width: 70%;
`

const TemplateText = styled.Text`
  margin-top: -20px;
  border: 1px solid ${props => props.theme.colors.secondary};
  padding: 30px 20px 20px;
  margin-bottom: 250px;
  color: ${props => props.theme.colors.onSurface};
`

const StyledIcon = styled(Icon)`
  align-self: center;
  width: 50%;
  height: 20%;
`

const CityNotCooperating = (): ReactElement | null => {
  const { t } = useTranslation('cityNotCooperating')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate
  const CityNotCooperatingIcon = buildConfigAssets().CityNotCooperatingIcon

  if (!template) {
    return null
  }

  const copyToClipboard = () => {
    Clipboard.setString(template)
    setIsCopied(true)
  }

  return (
    <Container>
      <Heading>{t('callToAction')}</Heading>

      <Description>{t('explanation')}</Description>
      {CityNotCooperatingIcon && <StyledIcon Icon={CityNotCooperatingIcon} />}
      <ListHeading>{t('whatToDo')}</ListHeading>
      <ListItem>
        <StepNumber>1</StepNumber>
        <StepExplanation>{t('findOutMail')}</StepExplanation>
      </ListItem>
      <ListItem>
        <StepNumber>2</StepNumber>
        <StepExplanation>{t('sendText')}</StepExplanation>
      </ListItem>

      <StyledButton onPress={copyToClipboard} text={isCopied ? t('common:copied') : t('copyText')} />
      <TemplateText>{template}</TemplateText>
    </Container>
  )
}

export default CityNotCooperating
