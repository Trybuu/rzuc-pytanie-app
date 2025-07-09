import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

const BackButton = () => {
  const navigation = useNavigation()

  const handleBackToPreviousRoute = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.viewWrapper}>
      <Pressable onPress={handleBackToPreviousRoute} style={styles.pressable}>
        <Ionicons name="return-up-back-outline" size={32} color="white" />
      </Pressable>
    </View>
  )
}

export default BackButton

const styles = StyleSheet.create({
  viewWrapper: {
    paddingVertical: 12,
  },
  pressable: {
    width: 48,
  },
})
