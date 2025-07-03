import { StyleSheet, View } from 'react-native'
import MyText from './MyText'

type CategoryDisplayProps = {
  categoryName: string | undefined
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ categoryName }) => {
  return (
    <View style={styles.categoryView}>
      <MyText align="left">{categoryName ?? 'Brak nazwy kategorii'}</MyText>
    </View>
  )
}

export default CategoryDisplay

const styles = StyleSheet.create({
  categoryView: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    marginBottom: 6,
    marginRight: 6,
  },
})
