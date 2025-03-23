import { useState } from 'react'

export const useFetch = (callback) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetching = async () => {
    try {
      setIsLoading(true)
      const response = await callback()
      return response
    } catch (e){
      setError(e.message)
    }finally {
      setIsLoading(false); 
    }
  }

  return [fetching, error, isLoading]
}