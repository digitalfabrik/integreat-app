import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShelterModel } from 'api-client'

import accessibleIcon from '../assets/shelter/accessible.svg'
import bathroomIcon from '../assets/shelter/bathroom.svg'
import bedIcon from '../assets/shelter/bed.svg'
import calendarIcon from '../assets/shelter/calendar.svg'
import emailIcon from '../assets/shelter/email.svg'
import houseIcon from '../assets/shelter/house.svg'
import lgbtqiIcon from '../assets/shelter/lgbtqi.svg'
import petIcon from '../assets/shelter/pet.svg'
import phoneIcon from '../assets/shelter/phone.svg'
import smokingIcon from '../assets/shelter/smoking.svg'
import timerIcon from '../assets/shelter/timer.svg'
import Caption from './Caption'
import ShelterContactRequestForm from './ShelterContactRequestForm'
import ShelterInformationSection from './ShelterInformationSection'
import { StyledButton } from './TextButton'
import Tooltip from './Tooltip'

const Container = styled.article`
  flex: 1;
  margin: 12px;
  padding: 16px 12px 28px;
  background-color: #f8f8f8;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);
`

const DetailButton = styled(StyledButton)`
  margin-left: 8px;
  margin-bottom: 0;
`

const Detail = styled.div`
  padding: 0 12px;
  margin-top: 10px;
  flex-direction: row;
  display: flex;
`

const IconContainer = styled.div`
  margin-right: 18px;
`

type IconWithTooltipProps = {
  tooltip: string
  icon: string
}

const IconWithTooltip = ({ tooltip, icon }: IconWithTooltipProps): ReactElement => (
  <IconContainer>
    <Tooltip text={tooltip} flow='up'>
      <img alt={tooltip} src={icon} width='20px' height='20px' />
    </Tooltip>
  </IconContainer>
)

type Props = {
  shelter: ShelterModel
  extended?: boolean
  cityCode: string
}

const ShelterInformation = ({ shelter, cityCode, extended = false }: Props): ReactElement => {
  const { beds, city, id, accommodationType, period, startDate, info, rooms, occupants, name } = shelter
  const { zipcode, hostType, languages, email, phone, comments, free, street } = shelter
  const { t } = useTranslation('shelter')

  const notSpecified = t('notSpecified')
  const location = street ? `${city}, ${street}` : city
  const bedsText = beds === 1 ? t('bed') : t('beds', { beds })
  const titleText = t('shelterTitle', { beds: bedsText, location })
  const titleHint = `(#${id})`
  const startDateText = moment(startDate, 'DD.MM.YYYY').isSameOrBefore(moment.now())
    ? t('now')
    : `${t('starting')} ${startDate}`

  const allowedPets = info.filter(it => it.includes('haustier'))
  const petsTooltip = allowedPets.length === 2 ? t('haustier') : t(allowedPets[0] ?? 'notSpecified')
  const petsAllowed = allowedPets.length !== 0

  const languagesText = languages.length !== 0 ? languages.map(it => t(it)).join(', ') : notSpecified

  return (
    <>
      {extended && <Caption title={`${titleText} (#${id})`} />}
      <Container>
        <ShelterInformationSection
          extended={extended}
          title={extended ? t('shelterInformation') : titleText}
          titleHint={extended ? undefined : titleHint}
          label={free ? t('free') : undefined}
          information={[
            { text: t(accommodationType), icon: houseIcon, tooltip: t('shelterType') },
            { text: bedsText, icon: bedIcon, tooltip: t('availableBeds') },
            { text: startDateText, icon: calendarIcon, tooltip: t('startDate') },
            { text: t(period), icon: timerIcon, tooltip: t('duration') }
          ]}>
          <Detail>
            {info.includes('bad') && <IconWithTooltip tooltip={t('bathroom')} icon={bathroomIcon} />}
            {info.includes('lgbtiq') && <IconWithTooltip tooltip={t('lgbtiq')} icon={lgbtqiIcon} />}
            {info.includes('barrierefrei') && <IconWithTooltip tooltip={t('accessible')} icon={accessibleIcon} />}
            {petsAllowed && <IconWithTooltip tooltip={petsTooltip} icon={petIcon} />}
            {info.includes('rauchen') && <IconWithTooltip tooltip={t('smoking')} icon={smokingIcon} />}
          </Detail>
        </ShelterInformationSection>
        {extended && (
          <>
            <ShelterInformationSection
              extended={extended}
              title={t('householdInformation')}
              information={[
                { text: t('rooms'), rightText: rooms?.toString() ?? notSpecified },
                { text: t('occupants'), rightText: occupants?.toString() ?? notSpecified },
                ...(occupants !== 0 ? [{ text: t('hostType'), rightText: hostType ? t(hostType) : notSpecified }] : [])
              ]}
            />
            <ShelterInformationSection
              extended={extended}
              title={t('hostInformation')}
              information={[
                { text: t('name'), rightText: name },
                { text: t('zipcode'), rightText: zipcode },
                { text: t('city'), rightText: city },
                { text: t('street'), rightText: street ?? notSpecified },
                { text: t('languages'), rightText: languagesText }
              ]}
            />
            {comments && (
              <ShelterInformationSection title={t('comments')} information={[{ text: comments }]} extended={extended} />
            )}
            {email || phone ? (
              <ShelterInformationSection
                extended={extended}
                title={t('contactInformation').toUpperCase()}
                elevated
                information={[
                  { icon: emailIcon, text: email ?? notSpecified, link: email ? `mailto:${email}` : undefined },
                  { icon: phoneIcon, text: phone ?? notSpecified, link: phone ? `tel:${phone}` : undefined }
                ]}
              />
            ) : (
              <ShelterContactRequestForm shelterId={id} cityCode={cityCode} />
            )}
          </>
        )}
        {!extended && (
          <DetailButton onClick={() => undefined} disabled={false}>
            {t('shelterButton')}
          </DetailButton>
        )}
      </Container>
    </>
  )
}

export default ShelterInformation
