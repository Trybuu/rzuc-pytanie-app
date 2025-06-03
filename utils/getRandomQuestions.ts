const getQuestionsFromCategory = async (categoryId: string) => {
  try {
    const data = await fetch(`/api/v1/question/`)
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

const getRandomQuestions = (categoryId: string) => {}

export default getRandomQuestions
