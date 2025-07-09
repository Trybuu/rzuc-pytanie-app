import MyText from '@/components/MyText'
import { ScrollView, StyleSheet, View } from 'react-native'

import { getCategories } from '@/api/category'
import BackButton from '@/components/BackButton'
import { useQuery } from '@tanstack/react-query'

type CategoryType = {
  id: number
  name: string
  createdAt: string
}

// 1. Dodać możliwość ponownej próby jeśli wystąpił błąd
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
        <BackButton />
        <MyText align="center">Loading...</MyText>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.loadingAndErrorContainer}>
        <BackButton />
        <MyText align="center">
          Błąd w trakcie pobierania kategorii ({error.message})
        </MyText>
      </View>
    )
  }

  return (
    <ScrollView style={styles.viewWrapper}>
      <BackButton />
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flexGrow: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  categoriesContainer: {
    flex: 1,
  },

  categoryContainer: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDD988',
    borderRadius: 24,
  },

  loadingAndErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
})
