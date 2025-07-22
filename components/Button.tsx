import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Pressable, PressableProps, StyleSheet } from 'react-native'

type MyButtonProps = PressableProps & {
  children: React.ReactNode
  bgColor?: 'purple' | 'red' | 'green'
}

const gradientColors: Record<
  NonNullable<MyButtonProps['bgColor']>,
  [string, string, ...string[]]
> = {
  purple: ['#A017F4', '#661499', '#7E12C1'],
  red: ['#cf2b2b', '#aa0909', '#c92121'],
  green: ['#1ef417', '#0d8e1e', '#12c138'],
}

const borderColors: Record<NonNullable<MyButtonProps['bgColor']>, string> = {
  purple: '#A017F4',
  red: '#f41717',
  green: '#49d167',
}

const MyButton: React.FC<MyButtonProps> = ({
  bgColor = 'purple',
  children,
  ...props
}) => {
  return (
    <LinearGradient
      colors={gradientColors[bgColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradient, { borderColor: borderColors[bgColor] }]}
    >
      <Pressable style={styles.pressable} {...props}>
        {children}
      </Pressable>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    borderWidth: 1,
    borderRadius: 100,
    marginVertical: 12,
  },
  pressable: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MyButton
