export type Category = {
  id: number
  name: string
  created_at: string
  description: string
  icon: string
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXPO_PUBLIC_API_KEY || '',
      },
    })

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
