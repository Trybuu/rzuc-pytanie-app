import { Audio } from 'expo-av'
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
    <Link {...props} asChild>
      <Pressable style={styles.button} onPress={handlePress}>
        {children}
      </Pressable>
    </Link>
  )
}

export default ButtonLink

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7E12C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    marginVertical: 12,
    alignItems: 'center',
    zIndex: 100,
  },
})
