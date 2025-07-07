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
            bgColor === 'blue' ? 'purple' : bgColor === 'red' ? 'red' : 'green',
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
    // backgroundImage: 'linear-gradient(90deg, #A017F4, #5D0D8E, #7E12C1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    borderRadius: 100,
    // boxShadow: '0 0 100px rgba(211, 23, 211, 0.75)',
  },
})

export default MyButton
