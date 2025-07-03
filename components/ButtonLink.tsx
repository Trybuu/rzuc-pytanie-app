import { Link, LinkProps } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

type ButtonLinkProps = LinkProps & {
  children: React.ReactNode
  withShadow?: boolean
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  withShadow = true,
  ...props
}) => {
  return (
    <Link style={styles.linkButton} {...props}>
      {children}
    </Link>
  )
}

export default ButtonLink

const styles = StyleSheet.create({
  linkButton: {
    backgroundImage: 'linear-gradient(90deg, #A017F4, #5D0D8E, #7E12C1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 12,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: '#9A58D7',
    borderRadius: 100,
    boxShadow: '0 0 100px rgba(211, 23, 211, 0.75)',
  },
})
