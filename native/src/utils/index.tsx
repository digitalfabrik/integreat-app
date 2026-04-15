import React, { ReactElement } from 'react'
import { Divider } from 'react-native-paper'

import { join } from 'shared'

export const withDividers = (items: (ReactElement | null)[]): ReactElement[] =>
  join(
    items.filter(it => it !== null),
    index => <Divider key={index} />,
  )
