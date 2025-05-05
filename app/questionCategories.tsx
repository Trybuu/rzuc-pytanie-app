import MyText from '@/components/MyText'
import { StyleSheet, View } from 'react-native'

export default function QuestionCategories() {
  return (
    <View style={styles.viewWrapper}>
      <MyText>Question Categories Screen</MyText>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: '#2B2F41',
    padding: 24,
  },
})
