import React, { ReactElement, ReactNode } from 'react'

import Text from '../base/Text'

const MockPage = ({ content, title, footer }: { title: string; content: string; footer?: ReactNode }): ReactElement => (
  <>
    <Text>{title}</Text>
    <Text>{content}</Text>
    {footer}
  </>
)

export default MockPage
