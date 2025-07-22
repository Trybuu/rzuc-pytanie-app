import socket from '@/client/socket'
import { useLobbyStore } from '@/store/lobbyStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'

const GameOptions = () => {
  const { resetLobby } = useLobbyStore((state) => state)

  const handleExitGame = () => {
    socket.disconnect()

    // resetLobby()
    router.replace({
      pathname: '/menu',
    })
    socket.connect()
  }

  return (
    <Pressable style={styles.pressable} onPress={handleExitGame}>
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
