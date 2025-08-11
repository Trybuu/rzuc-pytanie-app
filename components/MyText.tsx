import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

type MyTextProps = TextProps & {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  bold?: boolean
  size?: 's' | 'm' | 'l' | 'xl'
  color?: 'white' | 'gray' | 'orange' | 'purple' | 'yellow' | 'green' | 'red'
  flexWrap?: boolean
}

const MyText: React.FC<MyTextProps> = ({
  align = 'left',
  bold = false,
  size = 'm',
  color = 'white',
  flexWrap = false,
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
          fontSize:
            size === 's' ? 12 : size === 'm' ? 16 : size === 'l' ? 18 : 24,
          color:
            color === 'white'
              ? '#FFF'
              : color === 'orange'
              ? '#FF9D00'
              : color === 'purple'
              ? '#A017F4'
              : color === 'yellow'
              ? '#FDD988'
              : color === 'green'
              ? '#00B74A'
              : color === 'red'
              ? '#FF3D00'
              : '#D9DBDE',
          flex: flexWrap ? 1 : undefined,
          flexWrap: flexWrap ? 'wrap' : 'nowrap',
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
    // flex: 1,
    // flexWrap: 'wrap',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MuseoModerno',
    marginBottom: 6,
  },
})
