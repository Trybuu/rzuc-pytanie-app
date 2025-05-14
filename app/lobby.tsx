import socket from '@/client/socket'
import MyText from '@/components/MyText'
import { Lobby as LobbyType, useLobbyStore } from '@/store/lobbyStore'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

export default function Lobby() {
  const navigation = useNavigation()
  const params = useLocalSearchParams()
  const { lobbyCode } = params
  // const [players, setPlayers] = useState<Player[] | null>(null)

  // Wykorzystanie danych ze store
  const { accessCode, players } = useLobbyStore((state) => state)
  const { createLobby, setPlayers } = useLobbyStore()

  useEffect(() => {
    const listener = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      navigation.dispatch(e.data.action)
    })

    return () => {
      listener()
    }
  }, [])

  // Nasłuchiwanie socketów
  useEffect(() => {
    const handleLobbyCreated = (lobbyData: LobbyType) => {
      console.log('lobby utworzone')
      createLobby(lobbyData)
    }

    const handleLobbyUpdated = (lobbyData: LobbyType) => {
      console.log('Lobby zaktualizowane')
      setPlayers(lobbyData.players)
    }

    socket.on('lobbyCreated', handleLobbyCreated)
    socket.on('lobbyUpdated', handleLobbyUpdated)

    return () => {
      socket.off('lobbyCreated', handleLobbyCreated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
    }
  }, [createLobby, setPlayers])

  if (players)
    return (
      <View style={styles.viewWrapper}>
        <MyText>Lobby Screen {accessCode}</MyText>
        <View>
          {players?.map((player) => (
            <MyText key={player.id}>{player.playerName}</MyText>
          ))}
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#2B2F41',
    padding: 24,
  },

  viewContent: {
    marginVertical: 12,
  },
})
