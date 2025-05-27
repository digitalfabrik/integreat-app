import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

type ChatAcceptCustomPolicyProps = {
  onAcceptPolicy: () => void
  customPrivacyPolicy: string | null
}

const ChatAcceptCustomPolicy = ({ onAcceptPolicy, customPrivacyPolicy }: ChatAcceptCustomPolicyProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl p-6 shadow-xl max-w-lg w-full mx-4'>
        <h2 className='text-xl font-bold mb-4'>Privacy Policy</h2>
        <div className='mb-6 max-h-60 overflow-y-auto text-sm text-gray-700'>
          Do you accept the
          <Link to={customPrivacyPolicy}>Privacy Policy</Link>?
        </div>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onAcceptPolicy}
            className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700'
            type='button'>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatAcceptCustomPolicy
