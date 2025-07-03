import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

type MyTextProps = TextProps & {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  bold?: boolean
  size?: 's' | 'm' | 'l'
  color?: 'white' | 'gray' | 'orange' | 'purple'
}

const MyText: React.FC<MyTextProps> = ({
  align = 'left',
  bold = false,
  size = 'm',
  color = 'white',
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.text,
        {
          textAlign: align,
          fontWeight: bold ? '600' : '400',
          fontSize: size === 's' ? 12 : size === 'm' ? 16 : 18,
          color:
            color === 'white'
              ? '#FFF'
              : color === 'orange'
              ? '#FF9D00'
              : color === 'purple'
              ? '#A017F4'
              : '#D9DBDE',
        },
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
    marginBottom: 6,
  },
})
