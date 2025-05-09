import MyText from '@/components/MyText'
import { StyleSheet, View } from 'react-native'

import { getCategories } from '@/api/category'
import { useQuery } from '@tanstack/react-query'

type CategoryType = {
  id: number
  name: string
  createdAt: string
}

export default function QuestionCategories() {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<CategoryType[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes cache time
    refetchOnMount: false,
  })

  if (isLoading) {
    return (
      <View style={styles.loadingAndErrorContainer}>
        <MyText align="center">Loading...</MyText>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.loadingAndErrorContainer}>
        <MyText align="center">
          Błąd w trakcie pobierania kategorii ({error.message})
        </MyText>
      </View>
    )
  }

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.categoriesContainer}>
        {categories &&
          categories.map((category, index) => {
            return (
              <View key={index} style={styles.categoryContainer}>
                <MyText>{category.name}</MyText>
              </View>
            )
          })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: '#2B2F41',
    padding: 24,
  },

  categoriesContainer: {
    flex: 1,
  },

  categoryContainer: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF9D00',
    borderRadius: 24,
  },

  loadingAndErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2B2F41',
    padding: 24,
  },
})
