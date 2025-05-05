import { Link, LinkProps } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

type ButtonLinkProps = LinkProps & {
  children: React.ReactNode
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, ...props }) => {
  return (
    <Link style={styles.linkButton} {...props}>
      {children}
    </Link>
  )
}

export default ButtonLink

const styles = StyleSheet.create({
  linkButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 12,
    textAlign: 'center',
    borderRadius: 24,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    // Android shadow
    elevation: 5,
  },
})
