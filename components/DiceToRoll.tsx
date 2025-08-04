import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import MyText from './MyText'

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
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)
  const rotate = useSharedValue(0)

  useEffect(() => {
    let sound: Audio.Sound | null = null

    const playDiceSound = async () => {
      const result = await Audio.Sound.createAsync(
        require('@/assets/sounds/dice/dice-roll-1.mp3'),
      )
      sound = result.sound
      await sound.playAsync()
    }

    if (diceFace >= 1 && diceFace <= 6) {
      playDiceSound()

      // Sekwencja animacji
      translateY.value = withSequence(
        withTiming(-200, { duration: 500 }),
        withSpring(0, { damping: 20, stiffness: 80 }),
      )
      scale.value = withSequence(
        withTiming(1.8, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      )
      rotate.value = withSequence(
        withTiming(180, { duration: 400 }),
        withTiming(720, { duration: 400 }, () => {
          rotate.value = 0
          runOnJS(setAnimationCompleted)(true)
        }),
      )
    }

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [diceFace])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        {
          rotateZ: `${rotate.value}deg`,
        },
      ],
    }
  })

  const diceSource = diceImages[diceFace] ?? diceImages[1]

  const renderDifficultyText = () => {
    if (diceFace === 1 || diceFace === 2) {
      return (
        <MyText align="center" color="green" size="xl">
          Trudność pytania {diceFace}
        </MyText>
      )
    } else if (diceFace === 3 || diceFace === 4) {
      return (
        <MyText align="center" color="yellow" size="xl">
          Trudność pytania {diceFace}
        </MyText>
      )
    } else {
      return (
        <MyText align="center" color="red" size="xl">
          Trudność pytania {diceFace}
        </MyText>
      )
    }
  }

  return (
    <View style={styles.container}>
      {animationCompleted && renderDifficultyText()}

      <Animated.View style={animatedStyle}>
        <Image
          source={diceSource}
          style={styles.diceImage}
          resizeMode="contain"
        />
      </Animated.View>
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
