import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, LinkProps } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

type ButtonLinkProps = LinkProps & {
  withSoundEffect?: boolean
  children: React.ReactNode
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  withSoundEffect = true,
  children,
  ...props
}) => {
  const handlePress = async () => {
    if (withSoundEffect) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/effects/button-click.mp3'),
        )
        sound.setVolumeAsync(0.1)
        await sound.playAsync()
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync()
          }
        })
      } catch (error) {
        console.warn('Error playing sound:', error)
      }
    }
  }

  return (
    <LinearGradient
      colors={['#A017F4', '#661499', '#7E12C1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <Link {...props} asChild>
        <Pressable style={styles.button} onPress={handlePress}>
          {children}
        </Pressable>
      </Link>
    </LinearGradient>
  )
}

export default ButtonLink

const styles = StyleSheet.create({
  gradient: {
    borderWidth: 1,
    borderRadius: 100,
    marginVertical: 12,
    borderColor: '#A017F4',
  },

  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
})
