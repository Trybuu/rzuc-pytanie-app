import MyText from '@/components/MyText'
import { ScrollView, StyleSheet, View } from 'react-native'

import { getCategories } from '@/api/category'
import BackgroundWrapper from '@/components/BackgroundWrapper'
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
      <BackgroundWrapper>
        <View
          style={[
            styles.loadingAndErrorContainer,
            { paddingTop: headerHeight },
          ]}
        >
          <MyText align="center">Loading...</MyText>
        </View>
      </BackgroundWrapper>
    )
  }

  if (isError) {
    return (
      <BackgroundWrapper>
        <View
          style={[
            styles.loadingAndErrorContainer,
            { paddingTop: headerHeight },
          ]}
        >
          <MyText align="center">
            Błąd w trakcie pobierania kategorii ({error.message})
          </MyText>
        </View>
      </BackgroundWrapper>
    )
  }

  return (
    <BackgroundWrapper>
      <ScrollView style={styles.viewWrapper}>
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
    </BackgroundWrapper>
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
