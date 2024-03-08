import React, { ReactElement } from 'react'

import Text from '../base/Text'

const MockPage = ({ content, title }: { title: string; content: string }): ReactElement => (
  <>
    <Text>{title}</Text>
    <Text>{content}</Text>
  </>
)

export default MockPage
