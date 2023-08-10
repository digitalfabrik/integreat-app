import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { config } from 'translations'

import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'
import Modal from './Modal'

type FeedbackModalProps = {
  slug?: string
  cityCode: string
  language: string
  routeType: RouteType
  closeModal: () => void
}

const FeedbackModal = ({ closeModal, cityCode, language, routeType, slug }: FeedbackModalProps): ReactElement => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { t } = useTranslation('feedback')
  const title = isSubmitted ? t('thanksHeadline') : t('headline')
  const direction = config.getScriptDirection(language)

  return (
    <Modal title={title} closeModal={closeModal} direction={direction}>
      <FeedbackContainer
        isSearchFeedback={false}
        closeModal={closeModal}
        onSubmit={() => setIsSubmitted(true)}
        routeType={routeType}
        cityCode={cityCode}
        language={language}
        slug={slug}
      />
    </Modal>
  )
}

export default FeedbackModal
