import { usePathname } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Animated, Image, StyleSheet, View } from 'react-native'

type BackgroundWrapperProps = {
  children: React.ReactNode
}

const AnimatedImage = Animated.createAnimatedComponent(Image)

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const pathname = usePathname()
  const animatedScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const targetScale = pathname === '/' ? 1 : 2

    Animated.timing(animatedScale, {
      toValue: targetScale,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [pathname])

  return (
    <View style={styles.container}>
      <AnimatedImage
        source={require('../assets/images/graphics/background.png')}
        style={[
          styles.backgroundImage,
          {
            transform: [{ scale: animatedScale }],
          },
        ]}
        resizeMode="cover"
      />

      <View style={styles.content}>{children}</View>
    </View>
  )
}

export default BackgroundWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
})
