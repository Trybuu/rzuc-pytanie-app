import AntDesign from '@expo/vector-icons/AntDesign'
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native'

type ExitGameButtonProps = PressableProps

const ExitGameButton: React.FC<ExitGameButtonProps> = (props) => {
  return (
    <Pressable style={styles.button} {...props}>
      <AntDesign name="close" size={16} color="#eba9b4" />
      <Text style={styles.buttonText}>Wyjdź z lobby</Text>
    </Pressable>
  )
}

export default ExitGameButton

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    marginVertical: 12,
    padding: 6,
    borderRadius: 24,
    backgroundColor: '#E11D48',
    boxShadow: 'inset 2px -4px 2px rgb(194, 31, 66)',
  },

  buttonText: {
    color: '#eba9b4',
    fontSize: 16,
    fontFamily: 'MuseoModerno',
    marginLeft: 6,
  },
})
