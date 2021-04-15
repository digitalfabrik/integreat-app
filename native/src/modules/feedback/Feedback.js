// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, ScrollView, Text, TextInput } from 'react-native'
import type { ThemeType } from 'build-configs/ThemeType'
import type { TFunction } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-elements'
import Caption from '../common/components/Caption'
import type { FeedbackOriginType, SendingStatusType } from './FeedbackContainer'
import type { StyledComponent } from 'styled-components'
import buildConfig from '../app/constants/buildConfig'
import HappyIcon from '../common/components/assets/smile-happy.svg'
import SadIcon from '../common/components/assets/smile-sad.svg'

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

const Heading = styled(ThemedText)`
  font-size: 16px;
  text-align: center;
  padding: 10px 30px 30px;
`

const HappyIconContainer = styled.Image`
  margin: 100px auto 10px;
`

const SadIconContainer = styled.Image`
  margin: 0px auto 10px;
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
    let isSearchFeedback = false
    switch (feedbackOrigin) {
      case 'positive':
        title = t('positiveComment')
        break
      case 'negative':
        title = t('negativeComment')
        break
      case 'searchInformationNotFound':
        title = t('wantedInformation')
        isSearchFeedback = true
        break
      case 'searchNothingFound':
        title = t('wantedInformation')
        isSearchFeedback = true
        break
    }

    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          {!isSearchFeedback && <Caption theme={theme} title={t('feedback')} />}
          {feedbackOrigin === 'searchNothingFound' && (
            <>
              <SadIconContainer source={SadIcon} />
              <Heading theme={theme}>{t('nothingFound')}</Heading>
            </>
          )}
          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{title}</Description>
            {feedbackOrigin === 'positive' && <Text>({t('optionalInfo')})</Text>}
          </DescriptionContainer>
          <Input
            theme={theme}
            onChangeText={props.onCommentChanged}
            value={comment}
            multiline
            numberOfLines={3}
            autoFocus={!isSearchFeedback}
          />
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
            disabled={feedbackOrigin !== 'positive' && !comment}
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
          <HappyIconContainer source={HappyIcon} />
          <Caption theme={theme} title={t('feedback:feedbackSent')} />
          <ThemedText theme={theme}>{t('feedback:thanksMessage', { appName: buildConfig().appName })}</ThemedText>
        </>
      )
    }
  }

  const { theme } = props
  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
      <Wrapper theme={theme}>{renderBox()}</Wrapper>
    </ScrollView>
  )
}

export default Feedback
