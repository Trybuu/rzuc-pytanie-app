import BackButton from '@/components/BackButton'
import MyButton from '@/components/Button'
import CreatePlayer from '@/components/CreatePlayer'
import MyText from '@/components/MyText'
import { useCreateLobby } from '@/hooks/useCreateLobby'
import { getPlayerId } from '@/lib/getPlayerId'
import { useState } from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

export default function NewGame() {
  const { create } = useCreateLobby()
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string>('')
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false)

  const handleCreateLobby = async () => {
    try {
      if (playerName.trim().length < 3 || image === null) {
        Alert.alert('Uzupełnij wszystkie pola')
        return
      }

      if (!isImageUploaded) {
        Alert.alert('Proszę przesłać zdjęcie przed rozpoczęciem gry')
        return
      }

      const playerId = await getPlayerId()
      const result = await create(playerName, image)

      if (!result.success) {
        Alert.alert(`Błąd: ${result.message}`)
      }
    } catch (err) {
      console.error('Błąd w trakcie tworzenia lobby, client: ', err)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.viewContent}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton />

          <CreatePlayer
            playerName={playerName}
            image={image}
            setPlayerName={setPlayerName}
            setImage={setImage}
            onImageUploadComplete={(success) => setIsImageUploaded(success)}
          />

          <View>
            <MyButton onPress={handleCreateLobby}>
              <MyText align="center">Zaczynamy!</MyText>
            </MyButton>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  viewContent: {
    flexGrow: 1,
    paddingVertical: 54,
    paddingHorizontal: 24,
  },

  createPlayerView: {
    flex: 1,
    alignItems: 'center',
  },
})
