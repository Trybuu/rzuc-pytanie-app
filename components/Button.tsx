import { Pressable, PressableProps, StyleSheet } from 'react-native'

type MyButtonProps = PressableProps & {
  children: React.ReactNode
}

const MyButton: React.FC<MyButtonProps> = ({ children, ...props }) => {
  return (
    <Pressable style={styles.button} {...props}>
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 12,
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    textAlign: 'center',
    borderRadius: 24,
    boxShadow: 'inset px -4px 2px #2e65be',
  },
})

export default MyButton
