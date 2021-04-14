// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, Button, ScrollView, Text, TextInput } from 'react-native'
import type { ThemeType } from 'build-configs/ThemeType'
import type { TFunction } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Caption from '../../../modules/common/components/Caption'
import type { SendingStatusType } from '../containers/FeedbackContainer'
import type { StyledComponent } from 'styled-components'
import type { FeedbackOriginType } from '../containers/FeedbackModalContainer'
import buildConfig from '../../../modules/app/constants/buildConfig'

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
`

const MailInput = styled(Input)`
  height: 50px;
`

const Wrapper = styled.View`
  padding: 40px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const DescriptionContainer: StyledComponent<{||}, ThemeType, *> = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const Description = styled(ThemedText)`
  font-weight: bold;
`

export type PropsType = {|
  comment: string,
  contactMail: string,
  sendingStatus: SendingStatusType,
  onCommentChanged: (comment: string) => void,
  onFeedbackContactMailChanged: (contactMail: string) => void,
  feedbackOrigin: FeedbackOriginType,
  onSubmit: () => Promise<void>,
  theme: ThemeType,
  t: TFunction
|}

const Feedback = (props: PropsType) => {
  const renderBox = (): React.Node => {
    const { theme, t, feedbackOrigin, comment, contactMail, sendingStatus } = props
    let title
    switch (feedbackOrigin) {
      case 'positive':
        title = t('positiveComment')
        break
      case 'negative':
        title = t('negativeComment')
        break
      case 'searchInformationNotFound':
        title = t('informationNotFound')
        break
      case 'searchNotingFound':
        title = t('nothingFound')
        break
    }

    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          <Caption theme={theme} title={t('feedback')} />
          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{title}</Description>
            {feedbackOrigin !== 'negative' && <Text>({t('optionalInfo')})</Text>}
          </DescriptionContainer>
          <Input theme={theme} onChangeText={props.onCommentChanged} value={comment} multiline numberOfLines={3} />
          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{t('contactMailAddress')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </DescriptionContainer>
          <MailInput theme={theme} onChangeText={props.onFeedbackContactMailChanged} value={contactMail} />
          {sendingStatus === 'failed' && <Description theme={theme}>{t('failedSendingFeedback')}</Description>}
          <Button
            icon={<Icon name='send' size={15} color='black' style='material' />}
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor, marginTop: 15 }}
            disabled={feedbackOrigin === 'negative' && !comment}
            onPress={props.onSubmit}
            title={t('send')}
          />
        </>
      )
    } else if (sendingStatus === 'sending') {
      return <ActivityIndicator size='large' color='#0000ff' />
    } else {
      // sendingStatus === 'successful') {
      return (
        <>
          <Caption theme={theme} title={t('feedback:feedbackSent')} />
          <ThemedText theme={theme}>{t('feedback:thanksMessage', { appName: buildConfig().appName })}</ThemedText>
        </>
      )
    }
  }

  const { theme } = props
  return (
    <ScrollView>
      <Wrapper theme={theme}>{renderBox()}</Wrapper>
    </ScrollView>
  )
}

export default Feedback
