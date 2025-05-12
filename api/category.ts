// const apiUrl = 'http://localhost:3000/api/v1'
const apiUrl = 'http://192.168.1.11:3000/api/v1'

export const getCategories = async () => {
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
