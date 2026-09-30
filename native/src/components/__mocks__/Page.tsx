import React, { ReactElement, ReactNode } from 'react'

import Text from '../base/Text'

const MockPage = ({
  content,
  title,
  beforeTitle,
  beforeContent,
  footer,
}: {
  title: string
  beforeTitle?: ReactNode
  content: string
  beforeContent?: ReactNode
  footer?: ReactNode
}): ReactElement => (
  <>
    {beforeTitle}
    <Text>{title}</Text>
    {beforeContent}
    <Text>{content}</Text>
    {footer}
  </>
)

export default MockPage
