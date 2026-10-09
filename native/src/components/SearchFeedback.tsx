import React, { ReactElement, ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button, Card } from 'react-native-paper'
import styled from 'styled-components/native'

import { CHAT_ROUTE, FEEDBACK_ROUTE, getChatName, SendingStatusType } from 'shared'
import { FeedbackType } from 'shared/api'
import { config } from 'translations'

import { FeedbackHintIcon } from '../assets'
import Link from '../components/Link'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import FeedbackStatusBanner from './FeedbackStatusBanner'

const InformButton = styled(Button)`
  width: 80%;
  background-color: ${props => props.theme.colors.background};
`

const BulletItemWrapper = styled.View`
  flex: 1;
`

const StyledCard = styled(Card)`
  background-color: ${props => props.theme.colors.surfaceVariant};
  margin-top: 4px;
`

const BulletItem = ({ children }: { children: ReactNode }): ReactElement => (
  <View style={{ flexDirection: 'row' }}>
    <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
    <Text variant='body2'>{children}</Text>
  </View>
)

type SearchFeedbackProps = {
  routeType: FeedbackType
  language: string
  regionCode: string
  query?: string
  slug?: string
  sendingStatus: SendingStatusType
  handleSubmit: () => void
  hasResults?: boolean
  isChatEnabled: boolean
}

const SearchFeedback = ({
  routeType,
  language,
  regionCode,
  query,
  slug,
  sendingStatus,
  handleSubmit,
  hasResults,
  isChatEnabled,
}: SearchFeedbackProps): ReactElement => {
  const { t } = useTranslation()
  const { navigation } = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  const submitted = sendingStatus === 'successful' || sendingStatus === 'failed'
  const navigateToFeedback = () => {
    navigation.navigate(FEEDBACK_ROUTE, {
      routeType,
      language,
      regionCode,
      query,
      slug,
      rating: 'negative',
    })
  }

  const fallbackLanguage = config.sourceLanguage
  const isResults = hasResults
    ? t($ => $.feedback.search.informationNotFound)
    : t($ =>
        language === fallbackLanguage
          ? $.feedback.search.noResultsInUserLanguage
          : $.feedback.search.noResultsInUserAndSourceLanguage,
      )

  return (
    <>
      <Text variant='subtitle1'>{isResults}</Text>
      <Text variant='subtitle2'>{t($ => $.feedback.search.tryOptions)}</Text>
      <BulletItemWrapper>
        <BulletItem>{t($ => $.feedback.search.options.useSearchTerm)}</BulletItem>
        <BulletItem>{t($ => $.feedback.search.options.useSingleWord)}</BulletItem>
        {isChatEnabled && (
          <BulletItem>
            <Trans
              ns='feedback'
              i18nKey={$ => $.feedback.search.options.askChat}
              values={{ name: getChatName(buildConfig().appName) }}
              components={{
                Link: <Link onPress={() => navigation.navigate(CHAT_ROUTE)}>getChatName(buildConfig().appName)</Link>,
              }}
            />
          </BulletItem>
        )}
      </BulletItemWrapper>
      {submitted && !dismissed && (
        <FeedbackStatusBanner
          successful={sendingStatus === 'successful'}
          onClose={() => setDismissed(true)}
          onNavigateToFeedback={navigateToFeedback}
        />
      )}
      {!submitted && (
        <StyledCard mode='outlined'>
          <Card.Content style={{ flexDirection: 'row', gap: 12 }}>
            <Icon icon={FeedbackHintIcon} style={{ width: 58, height: 58 }} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text variant='subtitle2'>{t($ => $.feedback.search.informationMissing)}</Text>
              <Text variant='body2'>{t($ => $.feedback.search.helpToImprove, { appName: buildConfig().appName })}</Text>
              <InformButton mode='outlined' icon='bell-outline' onPress={handleSubmit}>
                {t($ => $.feedback.search.informUs)}
              </InformButton>
            </View>
          </Card.Content>
        </StyledCard>
      )}
    </>
  )
}

export default SearchFeedback
