import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

type MyTextProps = TextProps & {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  bold?: boolean
}

const MyText: React.FC<MyTextProps> = ({
  align = 'left',
  bold = false,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.text,
        { textAlign: align, fontWeight: bold ? '600' : '400' },
      ]}
      {...props}
    >
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
