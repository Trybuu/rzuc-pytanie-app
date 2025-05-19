import { StyleSheet, View } from 'react-native'
import MyText from './MyText'

const AccessCodeView = () => {
  return (
    <View style={styles.accessCodeWrapper}>
      <View style={styles.accessCodeTile}>
        <MyText align="center">5</MyText>
      </View>
      <View style={styles.accessCodeTile}>
        <MyText align="center">3</MyText>
      </View>
      <View style={styles.accessCodeTile}>
        <MyText align="center">7</MyText>
      </View>
      <View style={styles.accessCodeTile}>
        <MyText align="center">1</MyText>
      </View>
    </View>
  )
}

export default AccessCodeView

const styles = StyleSheet.create({
  accessCodeWrapper: {
    flexDirection: 'row',
  },

  accessCodeTile: {
    height: 42,
    width: 42,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})
