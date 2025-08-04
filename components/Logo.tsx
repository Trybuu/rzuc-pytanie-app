import { Image, StyleSheet, View } from 'react-native'

type LogoProps = {
  width: number
  height: number
}

const Logo: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <View style={styles.viewLogo}>
      <Image
        source={require('@/assets/images/graphics/logo.png')}
        style={{ width: width, height: height }}
        resizeMode="contain"
      ></Image>
    </View>
  )
}

export default Logo

const styles = StyleSheet.create({
  viewLogo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
