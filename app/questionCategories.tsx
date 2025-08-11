import MyText from '@/components/MyText'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { Category, getCategories } from '@/api/category'
import BackButton from '@/components/BackButton'
import Entypo from '@expo/vector-icons/Entypo'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// 1. Dodać możliwość ponownej próby jeśli wystąpił błąd
export default function QuestionCategories() {
  const [categoryDescExpandedId, setCategoryDescExpandedId] = useState<
    number | null
  >(0)
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes cache time
    refetchOnMount: false,
  })

  if (isLoading) {
    return (
      <View style={styles.loadingAndErrorContainer}>
        <BackButton />
        <MyText align="center">Wczytywanie...</MyText>
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

  const handleExpandDesc = (index: number) => {
    setCategoryDescExpandedId((prev) => {
      if (prev === index) {
        return null
      }
      return index
    })
  }

  return (
    <ScrollView style={styles.viewWrapper}>
      <BackButton />
      <View style={styles.categoriesContainer}>
        {categories &&
          categories.map((category, index) => {
            return (
              <Pressable key={index} onPress={() => handleExpandDesc(index)}>
                <View style={styles.categoryContainer}>
                  <MyText style={styles.categoryIcon}>{category.icon}</MyText>

                  <View style={styles.categoryContent}>
                    <MyText flexWrap={true}>{category.name}</MyText>

                    {index === categoryDescExpandedId ? (
                      <Entypo
                        name="chevron-with-circle-up"
                        size={24}
                        color="#FDD988"
                      />
                    ) : (
                      <Entypo
                        name="chevron-with-circle-down"
                        size={24}
                        color="#FDD988"
                      />
                    )}
                  </View>

                  <View
                    style={{
                      marginTop: 12,
                      display:
                        categoryDescExpandedId === index ? 'flex' : 'none',
                    }}
                  >
                    <MyText size="m">{category.description}</MyText>
                  </View>
                </View>
              </Pressable>
            )
          })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flexGrow: 1,
    paddingVertical: 54,
    paddingHorizontal: 24,
  },

  categoriesContainer: {
    flex: 1,
  },

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
    padding: 12,
  },

  categoryIcon: {
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 100,
    padding: 12,
    marginRight: 12,
  },

  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },

  chevron: {
    flexShrink: 0,
  },

  categoryName: {
    flexDirection: 'row',
    padding: 12,
  },

  loadingAndErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
})
