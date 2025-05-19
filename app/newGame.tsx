import MyButton from '@/components/Button'
import CreatePlayer from '@/components/CreatePlayer'
import MyText from '@/components/MyText'
import { useCreateLobby } from '@/hooks/useCreateLobby'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

export default function NewGame() {
  const { create } = useCreateLobby()
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string>('')

  const handleCreateLobby = async () => {
    try {
      if (playerName.trim().length < 3 || image === null) {
        Alert.alert('Uzupełnij wszystkie pola')
        return
      }

      const result = await create(playerName, image)

      if (!result.success) {
        Alert.alert(`Błąd: ${result.message}`)
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
