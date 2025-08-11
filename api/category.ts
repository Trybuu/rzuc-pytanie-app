import { API_ENDPOINT } from './apiData'

export type Category = {
  id: number
  name: string
  created_at: string
  description: string
  icon: string
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/category`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage =
        errorData?.message || `Request failed with status: ${response.status}`

      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.data
  } catch (err) {
    console.error('Error fetching categories:', err)
    throw err
  }
}
