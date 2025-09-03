import { Category, getCategories } from '@/api/category'
import BackButton from '@/components/BackButton'
import MyText from '@/components/MyText'
import Entypo from '@expo/vector-icons/Entypo'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

const FIVE_MINUTES = 5 * 60 * 1000

type CategoryItemProps = {
  category: Category
  expanded: boolean
  onPress: () => void
}

function CategoryItem({ category, expanded, onPress }: CategoryItemProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.categoryContainer}>
        <MyText style={styles.categoryIcon}>{category.icon}</MyText>

        <View style={styles.categoryContent}>
          <MyText flexWrap>{category.name}</MyText>
          <Entypo
            name={
              expanded ? 'chevron-with-circle-up' : 'chevron-with-circle-down'
            }
            size={24}
            color="#FDD988"
          />
        </View>

        {expanded && (
          <View style={styles.descriptionContainer}>
            <MyText size="m">{category.description}</MyText>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default function QuestionCategories() {
  const [expandedId, setExpandedId] = useState<number | null>(0)

  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: FIVE_MINUTES,
    refetchOnMount: false,
  })

  if (isLoading) {
    return (
      <View style={styles.loadingAndErrorContainer}>
        <BackButton />
        <View style={styles.loadingInfoContainer}>
          <ActivityIndicator size="large" color="#FDD988" />
        </View>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.loadingAndErrorContainer}>
        <BackButton />
        <View style={styles.loadingInfoContainer}>
          <MyText align="center">
            Błąd w trakcie pobierania kategorii ({error.message})
          </MyText>
          <Button title="Spróbuj ponownie" onPress={() => refetch()} />
        </View>
      </View>
    )
  }

  const toggleExpand = (index: number) => {
    setExpandedId((prev) => (prev === index ? null : index))
  }

  return (
    <ScrollView style={styles.viewWrapper}>
      <BackButton />
      <View style={styles.categoriesContainer}>
        {categories?.map((category, index) => (
          <CategoryItem
            key={category.id}
            category={category}
            expanded={expandedId === index}
            onPress={() => toggleExpand(index)}
          />
        ))}
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

  descriptionContainer: {
    marginTop: 12,
    width: '100%',
  },

  loadingAndErrorContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 54,
    paddingHorizontal: 24,
  },

  loadingInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
})
