import { socketCreateLobby } from '@/client/events'
import MyButton from '@/components/Button'
import CreatePlayer from '@/components/CreatePlayer'
import MyText from '@/components/MyText'
import { useLobbyStore } from '@/store/lobbyStore'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

export default function NewGame() {
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string>('')
  const router = useRouter()
  const { createLobby } = useLobbyStore()

  const handleCreateLobby = async () => {
    try {
      if (playerName.trim().length < 3 || image === null) {
        Alert.alert('Uzupełnij wszystkie pola')
        return
      }

      const lobby = await socketCreateLobby(playerName, image)
      console.log(lobby)

      if (lobby) {
        createLobby(lobby)

        router.push({
          pathname: '/lobby',
          params: { accessCode: lobby.accessCode },
        })
      }
    } catch (err) {
      console.error('Błąd w trakcie tworzenia lobby, client: ', err)
    }
  }

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.viewContent}>
        <CreatePlayer
          playerName={playerName}
          image={image}
          setPlayerName={setPlayerName}
          setImage={setImage}
        />

        <View>
          <MyButton onPress={handleCreateLobby}>
            <MyText align="center">Zaczynamy!</MyText>
          </MyButton>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: '#2B2F41',
    padding: 24,
  },

  viewContent: {
    flex: 1,
  },

  createPlayerView: {
    flex: 1,
    alignItems: 'center',
  },
})
