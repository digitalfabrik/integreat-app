import React, { ReactElement, ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button, Card } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { CHAT_ROUTE, FEEDBACK_ROUTE, getChatName, SendingStatusType } from 'shared'
import { FeedbackType } from 'shared/api'
import { config } from 'translations'

import { FeedbackHintIcon } from '../assets'
import Link from '../components/Link'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import FeedbackStatusAlert from './FeedbackStatusAlert'

const InformButton = styled(Button)`
  width: 80%;
  background-color: ${props => props.theme.colors.background};
`

const BulletItemWrapper = styled.View`
  flex: 1;
`

const StyledCard = styled(Card)`
  background-color: ${props => props.theme.colors.surfaceVariant};
  gap: 4px;
`

const BulletRow = styled.View`
  flex-direction: row;
  gap: 8px;
`

const BulletText = styled(Text)`
  flex-shrink: 1;
`

const BulletItem = ({ children }: { children: ReactNode }): ReactElement => (
  <BulletRow>
    <Text variant='body2'>{'\u2022'}</Text>
    <BulletText variant='body2'>{children}</BulletText>
  </BulletRow>
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
  setSendingStatus: (sendingStatus: SendingStatusType) => void
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
  setSendingStatus,
}: SearchFeedbackProps): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()
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
  const title = hasResults
    ? t($ => $.feedback.search.informationNotFound)
    : t($ =>
        language === fallbackLanguage
          ? $.feedback.search.noResultsInUserLanguage
          : $.feedback.search.noResultsInUserAndSourceLanguage,
      )

  const description =
    sendingStatus === 'successful' ? t($ => $.feedback.thanks.description) : t($ => $.error.unknownError)

  return (
    <>
      <Text variant='subtitle1'>{title}</Text>
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
                Link: <Link onPress={() => navigation.navigate(CHAT_ROUTE)} />,
              }}
            />
          </BulletItem>
        )}
      </BulletItemWrapper>
      {sendingStatus === 'successful' && !dismissed && (
        <FeedbackStatusAlert
          severity='success'
          title={t($ => $.feedback.thanks.title)}
          description={description}
          onClose={() => setDismissed(true)}
          actions={
            <>
              <Text variant='body2' style={{ color: theme.colors.onSuccess }}>
                {t($ => $.feedback.thanks.addDetails)}
              </Text>
              <Link onPress={navigateToFeedback}>{t($ => $.feedback.give)}</Link>
            </>
          }
        />
      )}
      {sendingStatus === 'failed' && !dismissed && (
        <FeedbackStatusAlert
          severity='error'
          title={t($ => $.error.title)}
          description={description}
          onClose={() => setSendingStatus('idle')}
        />
      )}
      {!submitted && (
        <StyledCard mode='outlined'>
          <Card.Content style={{ flexDirection: 'row', gap: 12 }}>
            <Icon icon={FeedbackHintIcon} style={{ width: 64, height: 64 }} />
            <View style={{ flex: 1, gap: 4 }}>
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
