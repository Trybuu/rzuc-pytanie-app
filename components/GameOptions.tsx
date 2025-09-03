import Ionicons from '@expo/vector-icons/Ionicons'
import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native'

type GameOptionsProps = {
  handleExitLobby: () => void
}

const GameOptions: React.FC<GameOptionsProps> = ({ handleExitLobby }) => {
  const handleCancel = () => {
    console.log('Anulowano wyjście z gry')
  }

  const handleButtonClick = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert('Wyjście z gry', 'Czy na pewno chcesz opuścić grę?', [
        { text: 'Anuluj', onPress: handleCancel, style: 'cancel' },
        { text: 'Tak', onPress: handleExitLobby },
      ])
    } else {
      handleExitLobby()
    }
  }

  return (
    <Pressable style={styles.pressable} onPress={handleButtonClick}>
      <Text>
        <Ionicons name="exit-outline" size={24} color="red" />
      </Text>
    </Pressable>
  )
}

export default GameOptions

const styles = StyleSheet.create({
  pressable: {
    width: 48,
    padding: 12,
  },
})
