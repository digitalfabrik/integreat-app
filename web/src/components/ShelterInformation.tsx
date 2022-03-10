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
import timerIcon from '../assets/shelter/timer.svg'
import { uppercaseFirstLetter } from '../utils/stringUtils'
import Caption from './Caption'
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
  padding: 8px 24px;
`

const Detail = styled.div`
  padding: 0 12px;
  margin-top: 10px;
  flex-direction: row;
  display: flex;
`

const TooltipContainer = styled.div`
  margin-right: 18px;
`

type IconWithTooltipProps = {
  tooltip: string
  icon: string
}

const IconWithTooltip = ({ tooltip, icon }: IconWithTooltipProps): ReactElement => (
  <TooltipContainer>
    <Tooltip text={tooltip} flow='right'>
      <img alt={tooltip} src={icon} width='20px' height='20px' />
    </Tooltip>
  </TooltipContainer>
)

type Props = {
  shelter: ShelterModel
  extended?: boolean
}

const ShelterInformation = ({ shelter, extended = false }: Props): ReactElement => {
  const { beds, city, id, accommodationType, period, startDate, info, rooms, occupants, name } = shelter
  const { zipcode, hostType, languages, email, phone, comments, free } = shelter
  const { t } = useTranslation('shelter')

  const quarter = shelter.quarter && shelter.quarter !== 'andere' ? uppercaseFirstLetter(shelter.quarter) : null
  const location = quarter ?? city
  const bedsText = beds === 1 ? t('bed') : t('beds', { beds })
  const titleText = t('shelterTitle', { beds: bedsText, location })
  const titleHint = `(#${id})`
  const startDateText = moment(startDate, 'DD.MM.YYYY').isSameOrBefore(moment.now())
    ? t('now')
    : `${t('starting')} ${startDate}`

  const allowedPets = info.filter(it => it.includes('haustier'))
  const petsTooltip = allowedPets.length === 2 ? t('haustier') : t(allowedPets[0])
  const petsAllowed = allowedPets.length !== 0

  const languagesText = languages.length !== 0 ? languages.map(it => t(it)).join(', ') : t('notSpecified')

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
            { text: t(accommodationType), icon: houseIcon },
            { text: bedsText, icon: bedIcon },
            { text: startDateText, icon: calendarIcon },
            { text: t(period), icon: timerIcon }
          ]}>
          <Detail>
            {info.includes('bad') && <IconWithTooltip tooltip={t('bathroom')} icon={bathroomIcon} />}
            {info.includes('lgbtiq') && <IconWithTooltip tooltip={t('lgbtiq')} icon={lgbtqiIcon} />}
            {info.includes('barrierefrei') && <IconWithTooltip tooltip={t('accessible')} icon={accessibleIcon} />}
            {petsAllowed && <IconWithTooltip tooltip={petsTooltip} icon={petIcon} />}
          </Detail>
        </ShelterInformationSection>
        {extended && (
          <>
            <ShelterInformationSection
              extended={extended}
              title={t('additionalInformation')}
              separationLine
              information={[
                { text: t('rooms'), rightText: rooms?.toString() ?? t('notSpecified') },
                { text: t('occupants'), rightText: occupants?.toString() ?? t('notSpecified') }
              ]}
            />
            <ShelterInformationSection
              extended={extended}
              title={t('hostInformation')}
              separationLine
              information={[
                { text: t('name'), rightText: name },
                { text: t('zipcode'), rightText: zipcode },
                { text: t('city'), rightText: city },
                ...(quarter ? [{ text: t('quarter'), rightText: occupants?.toString() ?? t('notSpecified') }] : []),
                { text: t('hostType'), rightText: hostType ? t(hostType) : t('notSpecified') },
                { text: t('languages'), rightText: languagesText }
              ]}
            />
            {comments && (
              <ShelterInformationSection
                title={t('comments')}
                information={[{ text: comments }]}
                extended={extended}
                separationLine
              />
            )}
            <ShelterInformationSection
              extended={extended}
              title={t('contactInformation').toUpperCase()}
              elevated
              information={[
                { icon: emailIcon, text: email },
                { icon: phoneIcon, text: phone ?? t('notSpecified') }
              ]}
            />
          </>
        )}
        {!extended && (
          <DetailButton onClick={() => undefined} disabled={false}>
            {' '}
            {t('shelterButton')}
          </DetailButton>
        )}
      </Container>
    </>
  )
}

export default ShelterInformation
