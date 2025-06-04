import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ContactModel } from 'shared/api'

import { MailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import HorizontalLine from './HorizontalLine'
import PoiDetailRow from './PoiDetailRow'
import Text from './base/Text'

const StyledContactHeader = styled(Text)`
  margin-bottom: 6px;
  color: ${props => props.theme.colors.textColor};
`

type ContactProps = {
  contact: ContactModel
  isLastContact?: boolean
}

const Contact = ({
  contact: { headline, website, phoneNumber, email, mobilePhoneNumber },
  isLastContact,
}: ContactProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      <StyledContactHeader>{headline ?? t('contactInformation')}</StyledContactHeader>
      {!!website && (
        <PoiDetailRow externalUrl={website} accessibilityLabel={t('website')} text={website} Icon={WebsiteIcon} />
      )}
      {!!phoneNumber && (
        <PoiDetailRow
          externalUrl={`tel:${phoneNumber}`}
          accessibilityLabel={t('phone')}
          text={phoneNumber}
          Icon={PhoneIcon}
        />
      )}
      {!!mobilePhoneNumber && (
        <PoiDetailRow
          externalUrl={`tel:${mobilePhoneNumber}`}
          accessibilityLabel={t('mobilePhone')}
          text={mobilePhoneNumber}
          Icon={PhoneIcon}
        />
      )}
      {!!email && (
        <PoiDetailRow externalUrl={`mailto:${email}`} accessibilityLabel={t('eMail')} text={email} Icon={MailIcon} />
      )}
      {!isLastContact && <HorizontalLine />}
    </>
  )
}

export default Contact
