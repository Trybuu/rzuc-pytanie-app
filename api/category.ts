// const apiUrl = 'http://localhost:3000/api/v1'
const apiUrl = 'http://192.168.1.13:3000/api/v1'

export type Category = {
  id: number
  name: string
  created_at: string
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${apiUrl}/category`)

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
