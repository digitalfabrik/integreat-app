import { useEffect } from 'react'

const useUpdateDimensions = (): void =>
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

export default useUpdateDimensions
