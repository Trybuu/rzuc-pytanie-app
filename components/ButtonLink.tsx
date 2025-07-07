import { Link, LinkProps } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

type ButtonLinkProps = LinkProps & {
  children: React.ReactNode
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, ...props }) => {
  return (
    <Link {...props} asChild>
      <Pressable style={styles.button}>{children}</Pressable>
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
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
