import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'

const diceImages: Record<number, any> = {
  1: require('@/assets/images/flat3d-dice/dice-1.png'),
  2: require('@/assets/images/flat3d-dice/dice-2.png'),
  3: require('@/assets/images/flat3d-dice/dice-3.png'),
  4: require('@/assets/images/flat3d-dice/dice-4.png'),
  5: require('@/assets/images/flat3d-dice/dice-5.png'),
  6: require('@/assets/images/flat3d-dice/dice-6.png'),
}

type DiceToRollProps = {
  diceFace: number
}

const DiceToRoll: React.FC<DiceToRollProps> = ({ diceFace }) => {
  const translateY = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current
  const rotate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (diceFace !== 0) {
      // Reset
      translateY.setValue(0)
      scale.setValue(1)
      rotate.setValue(0)

      // Animate
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -80,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ]),
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 4,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 2,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Reset rotation value for reuse
        rotate.setValue(0)
      })
    }
  }, [diceFace])

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  })

  const animatedStyle = {
    transform: [{ translateY }, { scale }, { rotateZ: rotateInterpolate }],
  }

  return (
    <View style={styles.container}>
      {diceFace !== 0 && (
        <Animated.Image
          source={diceImages[diceFace]}
          style={[styles.diceImage, animatedStyle]}
        />
      )}
    </View>
  )
}

export default DiceToRoll

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceImage: {
    width: 150,
    height: 150,
  },
})
