import { Image, Linking, Pressable, StyleSheet, View } from 'react-native'
import MyText from './MyText'

export default function RateUs() {
  const openAppStore = () => {
    const url = `itms-apps://apps.apple.com/app/6752801297?action=write-review`

    Linking.openURL(url)
  }

  return (
    <Pressable onPress={openAppStore} style={styles.wrapper}>
      <View style={styles.topContainer}>
        <Image
          source={require('@/assets/images/graphics/goldMedal.png')}
          style={styles.medal}
        />
      </View>
      <MyText align="left">Oceń aplikację w AppStore!</MyText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    borderRadius: 12,
  },
  topContainer: {
    alignItems: 'center',
    padding: 12,
  },
  bottomContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  medal: {
    width: 32,
    height: 32,
  },
})
