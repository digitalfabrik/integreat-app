import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ContactModel } from 'shared/api'

import { ExternalLinkIcon, MailIcon, PhoneIcon, WebsiteIcon, MobilePhoneIcon } from '../assets'
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
  contact: { headline, website, phoneNumber, email, mobileNumber },
  isLastContact,
}: ContactProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      <StyledContactHeader>{headline ?? t('contactInformation')}</StyledContactHeader>
      {!!website && (
        <PoiDetailRow
          externalUrl={website}
          accessibilityLabel={t('website')}
          text={t('website')}
          Icon={WebsiteIcon}
          IconEnd={ExternalLinkIcon}
        />
      )}
      {!!phoneNumber && (
        <PoiDetailRow
          externalUrl={`tel:${phoneNumber}`}
          accessibilityLabel={t('phone')}
          text={phoneNumber}
          Icon={PhoneIcon}
        />
      )}
      {mobileNumber != null && (
        <PoiDetailRow
          externalUrl={`tel:${mobileNumber}`}
          accessibilityLabel={t('mobilePhone')}
          text={mobileNumber}
          Icon={MobilePhoneIcon}
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
