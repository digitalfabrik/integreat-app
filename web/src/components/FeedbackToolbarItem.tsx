import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SEARCH_ROUTE } from 'api-client'

import { FeedbackIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackModal from './FeedbackModal'
import ToolbarItem from './ToolbarItem'

type FeedbackToolbarItemProps = {
  route: RouteType
  slug?: string
}

const FeedbackToolbarItem = ({ route, slug }: FeedbackToolbarItemProps): ReactElement => {
  const { cityCode, languageCode } = useCityContentParams()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const { t } = useTranslation('feedback')

  // TODO Set aria-hidden on rest
  return (
    <>
      {route !== SEARCH_ROUTE && isFeedbackOpen && (
        <FeedbackModal
          cityCode={cityCode}
          language={languageCode}
          routeType={route}
          slug={slug}
          visible={isFeedbackOpen}
          closeModal={() => setIsFeedbackOpen(false)}
        />
      )}
      <ToolbarItem icon={FeedbackIcon} text={t('feedback')} onClick={() => setIsFeedbackOpen(true)} />
    </>
  )
}

export default FeedbackToolbarItem
