import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ChatAcceptCustomPolicyProps = {
  onAccept: () => void
  onDecline?: () => void
}

const ChatAcceptCustomPolicy = ({ onAccept, onDecline }: ChatAcceptCustomPolicyProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl p-6 shadow-xl max-w-lg w-full mx-4'>
        <h2 className='text-xl font-bold mb-4'>Privacy Policy</h2>
        <div className='mb-6 max-h-60 overflow-y-auto text-sm text-gray-700'>
          <p>
            We use cookies and other technologies to enhance your experience. By clicking "Accept", you agree to our
            privacy policy and terms of use. For more information, read our full Privacy Policy.
          </p>
        </div>
        <div className='flex justify-end gap-4'>
          {onDecline && (
            <button
              onClick={onDecline}
              className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100'
              type='button'>
              Decline
            </button>
          )}
          <button
            onClick={onAccept}
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
