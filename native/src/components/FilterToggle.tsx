import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Icon from './base/Icon'
import Text from './base/Text'

const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

type DateFilterToggleProps = {
  isDateFilterActive: boolean
  setToggleDateFilter: (isEnabled: boolean) => void
}

const FilterToggle = ({ isDateFilterActive, setToggleDateFilter }: DateFilterToggleProps): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <StyledButton onPress={() => setToggleDateFilter(!isDateFilterActive)} focusable>
      <Icon source={isDateFilterActive ? 'arrow-collapse' : 'filter-variant'} />
      <Text variant='h6' style={{ padding: 6 }}>
        {t(isDateFilterActive ? 'hideFilters' : 'showFilters')}
      </Text>
    </StyledButton>
  )
}

export default FilterToggle
