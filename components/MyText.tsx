import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

type MyTextProps = TextProps & {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

const MyText: React.FC<MyTextProps> = ({
  align = 'left',
  children,
  ...props
}) => {
  return (
    <Text style={[styles.text, { textAlign: align }]} {...props}>
      {children}
    </Text>
  )
}

export default MyText

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MuseoModerno',
  },
})
