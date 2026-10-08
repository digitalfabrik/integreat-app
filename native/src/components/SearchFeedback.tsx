import React, { ReactElement, ReactNode } from 'react'
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
  slug?: string
  sendingStatus: SendingStatusType
  alertStatusOpen: boolean
  handleSubmit: () => void
  isChatEnabled: boolean
  onClearSearch?: () => void
}

const SearchFeedback = ({
  routeType,
  language,
  regionCode,
  alertStatusOpen,
  slug,
  sendingStatus,
  handleSubmit,
  isChatEnabled,
  onClearSearch,
}: SearchFeedbackProps): ReactElement => {
  const { t } = useTranslation()
  const { navigation } = useNavigate()

  const fallbackLanguage = config.sourceLanguage

  const navigateToFeedback = () =>
    navigation.navigate(FEEDBACK_ROUTE, { routeType, language, regionCode, slug, rating: 'negative' })

  const dismissBanner = () => {
    onClearSearch?.()
  }

  return (
    <>
      <Text variant='subtitle1'>
        {language === fallbackLanguage
          ? t($ => $.feedback.search.noResultsInUserLanguage)
          : t($ => $.feedback.search.noResultsInUserAndSourceLanguage)}
      </Text>
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
      {alertStatusOpen ? (
        <FeedbackStatusBanner
          successful={sendingStatus === 'successful'}
          onClose={dismissBanner}
          onNavigateToFeedback={navigateToFeedback}
        />
      ) : (
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
