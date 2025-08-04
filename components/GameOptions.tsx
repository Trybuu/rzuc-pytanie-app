import socket from '@/client/socket'
import { useLobbyStore } from '@/store/lobbyStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Alert, Pressable, StyleSheet, Text } from 'react-native'

const GameOptions = () => {
  const { resetLobby } = useLobbyStore((state) => state)

  const handleExitGame = () => {
    socket.disconnect()

    resetLobby()
    router.push({
      pathname: '/menu',
    })
    socket.connect()
  }

  const handleCancel = () => {
    console.log('Anulowano wyjście z gry')
  }

  const handleButtonClick = () => {
    Alert.alert('Wyjście z gry', 'Czy na pewno chcesz opuścić grę?', [
      { text: 'Anuluj', onPress: handleCancel, style: 'cancel' },
      { text: 'Tak', onPress: handleExitGame },
    ])
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
