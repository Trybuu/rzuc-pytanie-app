import { ImageBackground, StyleSheet } from 'react-native'

type BackgroundWrapperProps = {
  children: React.ReactNode
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/images/graphics/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  )
}

export default BackgroundWrapper

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})
