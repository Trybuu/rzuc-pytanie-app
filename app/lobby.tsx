import MyText from '@/components/MyText'
import { useLobbyStore } from '@/store/lobbyStore'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

export default function Lobby() {
  const navigation = useNavigation()
  const params = useLocalSearchParams()
  const { lobbyCode } = params
  // const [players, setPlayers] = useState<Player[] | null>(null)

  // Wykorzystanie danych ze store
  const players = useLobbyStore((state) => state.players)

  useEffect(() => {
    const listener = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      navigation.dispatch(e.data.action)
    })
  }, [])

  if (players)
    return (
      <View style={styles.viewWrapper}>
        <MyText>Lobby Screen {lobbyCode}</MyText>
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
