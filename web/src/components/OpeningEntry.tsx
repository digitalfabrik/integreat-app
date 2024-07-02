import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TimeSlot } from 'shared/api/types'

import { NoteIcon } from '../assets'
import Portal from './Portal'
import SharingPopup from './SharingPopup'
import Tooltip from './Tooltip'
import Icon from './base/Icon'

const fontBold = 600
const fontStandard = 400

const EntryContainer = styled.div<{ isCurrentDay: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-weight: ${props => (props.isCurrentDay ? fontBold : fontStandard)};
  position: relative;
`

const Timeslot = styled.div`
  display: flex;
  flex-direction: column;
`

const TimeSlotEntry = styled.span`
  &:not(:first-child) {
    margin-top: 8px;
  }
`

const StyledIcon = styled(Icon)`
  width: 18px;
  height: 18px;
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  appointmentOnly: boolean
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  appointmentOnly,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  const positioningRef = useRef<HTMLDivElement>(null)
  const [iconOffsetLeft, setIconOffsetLeft] = useState(0)
  const [iconOffsetTop, setIconOffsetTop] = useState(0)

  useEffect(() => {
    if (positioningRef.current) {
      setIconOffsetLeft(positioningRef.current.getBoundingClientRect().right + 10)
    }
  }, [positioningRef.current])

  const updateOffsetTop = () => {
    if (positioningRef.current) {
      setIconOffsetTop(positioningRef.current.getBoundingClientRect().top)
    }
  }

  useEffect(() => {
    if (!appointmentOnly) {
      return
    }
    updateOffsetTop()
    window.addEventListener('wheel', updateOffsetTop)
    return () => {
      window.removeEventListener('wheel', updateOffsetTop)
    }
  }, [])

  return (
    <EntryContainer isCurrentDay={isCurrentDay} id={`openingEntryContainer-${weekday}`} ref={positioningRef}>
      <span>{weekday}</span>
      {allDay && <span>{t('allDay')}</span>}
      {closed && <span>{t('closed')}</span>}
      {!allDay && !closed && timeSlots.length > 0 && (
        <Timeslot>
          {timeSlots.map(timeSlot => (
            <TimeSlotEntry key={`${weekday}-${timeSlot.start}`}>
              {timeSlot.start}-{timeSlot.end}
            </TimeSlotEntry>
          ))}
        </Timeslot>
      )}
      {/* TODO: Put into a separate component */}
      {appointmentOnly && (
        <>
          <Portal className='appointment-only-tooltip' show>
            <div
              style={{
                position: 'fixed',
                left: iconOffsetLeft,
                top: iconOffsetTop,
              }}>
              <Tooltip text={'to be translated'} flow='up' active>
                <StyledIcon src={NoteIcon} />
              </Tooltip>
            </div>
          </Portal>
        </>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
