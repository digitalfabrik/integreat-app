import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import List from '../components/List'
import Icon from '../components/base/Icon'
import TextButton from '../components/base/TextButton'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'

const Container = styled.View`
  display: flex;
  flex: 1;
  padding: 30px 30px 0 30px;
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
  top: -130px;
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

const StyledButton = styled(TextButton)`
  top: -130px;
  z-index: 1;
  margin: 15px auto 0;
  width: 70%;
`

const TemplateText = styled.Text`
  top: -150px;
  border: 1px solid ${props => props.theme.colors.themeColor};
  padding: 50px 30px 30px;
  margin-bottom: 40px;
`

const StyledIcon = styled(Icon)`
  margin: 10px 0;
  align-self: center;
  width: 50%;
  height: 30%;
`

type Step = {
  number: string
  id: string
  explanation: string
}

const CityNotCooperating = (): ReactElement | null => {
  const { t } = useTranslation('cityNotCooperating')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate
  const CityNotCooperatingIcon = buildConfigAssets().CityNotCooperatingIcon

  const steps: Step[] = [
    {
      id: '1',
      number: '1',
      explanation: 'findOutMail',
    },
    {
      id: '2',
      number: '2',
      explanation: 'sendText',
    },
  ]

  if (!template) {
    return null
  }

  const copyToClipboard = () => {
    Clipboard.setString(template)
    setIsCopied(true)
  }

  const renderStepsList = ({ item }: { item: Step }) => (
    <ListItem>
      <StepNumber>{item.number}</StepNumber>
      <StepExplanation>{t(item.explanation)}</StepExplanation>
    </ListItem>
  )

  const CooperationHeader = (
    <>
      <Heading>{t('callToAction')}</Heading>
      <Description>{t('explanation')}</Description>
      {CityNotCooperatingIcon && <StyledIcon Icon={CityNotCooperatingIcon} />}
      <ListHeading>{t('whatToDo')}</ListHeading>
    </>
  )

  const CooperationFooter = (
    <>
      <StyledButton
        onPress={copyToClipboard}
        text={isCopied ? t('common:copied') : t('copyText')}
        accessibilityRole='button'
        accessibilityLabel={isCopied ? t('Text has been copied') : t('Copy Text')}
      />
      <TemplateText>{template}</TemplateText>
    </>
  )

  return (
    <Container>
      <List
        items={steps}
        renderItem={renderStepsList}
        Header={CooperationHeader}
        Footer={CooperationFooter}
        keyExtractor={item => item.id}
      />
    </Container>
  )
}

export default CityNotCooperating
