import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'

const Container = styled.ScrollView`
  display: flex;
  padding: 30px;
`

const Heading = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 18px;
  padding: 20px 20px 40px;
  text-align: center;
`

const Description = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
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
  background-color: ${props => props.theme.colors.themeColor};
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
`

const Icon = styled.Image`
  align-self: center;
  width: 50%;
  resize-mode: contain;
`

const ButtonContainer = styled.View`
  z-index: 1;
  margin: 15px auto 0;
  width: 70%;
  height: 40px;
`

const TemplateText = styled.Text`
  top: -20px;
  border: 1px solid ${props => props.theme.colors.themeColor};
  padding: 50px 30px 30px;
  margin-bottom: 40px;
`

const CityNotCooperating = (): ReactElement => {
  const { t } = useTranslation('cityNotCooperating')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const theme = useTheme()
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate!

  const copyToClipboard = () => {
    Clipboard.setString(template)
    setIsCopied(true)
  }

  return (
    <Container>
      <Heading>{t('callToAction')}</Heading>

      <Description>{t('explanation')}</Description>
      <Icon source={buildConfigAssets().cityNotCooperatingIcon!} />
      <ListHeading>{t('whatToDo')}</ListHeading>
      <ListItem>
        <StepNumber>1</StepNumber>
        <StepExplanation>{t('findOutMail')}</StepExplanation>
      </ListItem>
      <ListItem>
        <StepNumber>2</StepNumber>
        <StepExplanation>{t('sendText')}</StepExplanation>
      </ListItem>

      <ButtonContainer>
        <Button
          onPress={copyToClipboard}
          title={isCopied ? t('textCopied') : t('copyText')}
          buttonStyle={{
            backgroundColor: theme.colors.themeColor,
          }}
          titleStyle={{
            color: theme.colors.textColor,
            fontFamily: theme.fonts.native.contentFontRegular,
          }}
        />
      </ButtonContainer>
      <TemplateText>{template}</TemplateText>
    </Container>
  )
}

export default CityNotCooperating
