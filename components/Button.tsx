import { Pressable, PressableProps, StyleSheet } from 'react-native'

type MyButtonProps = PressableProps & {
  children: React.ReactNode
  bgColor?: 'blue' | 'red' | 'green'
}

const MyButton: React.FC<MyButtonProps> = ({
  bgColor = 'blue',
  children,
  ...props
}) => {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor:
            bgColor === 'blue'
              ? '#3B82F6'
              : bgColor === 'red'
              ? '#E11D48'
              : '#10B981',
        },
      ]}
      {...props}
    >
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
    boxShadow: 'inset px -4px 2px #3b3b3b6f',
  },
})

export default MyButton
