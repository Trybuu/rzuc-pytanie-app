import AntDesign from '@expo/vector-icons/AntDesign'
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native'

type ExitGameButtonProps = PressableProps

const ExitGameButton: React.FC<ExitGameButtonProps> = (props) => {
  return (
    <Pressable style={styles.button} {...props}>
      <AntDesign name="close" size={16} color="#fff" />
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
    // backgroundImage: 'linear-gradient(90deg, #b82020, #860606, #ce1a1a)',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#ce1a1a',
    borderRadius: 100,
    // boxShadow: '0 0 100px rgba(206, 26, 26, 0.75)',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'MuseoModerno',
    marginLeft: 6,
  },
})
