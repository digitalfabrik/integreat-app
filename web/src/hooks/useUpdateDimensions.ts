import { useEffect } from 'react'

export const updateDimensions = (): boolean => window.dispatchEvent(new Event('resize'))

const useUpdateDimensions = (): void =>
  useEffect(() => {
    updateDimensions()
  }, [])

export default useUpdateDimensions
