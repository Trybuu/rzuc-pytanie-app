import AccessCodeInput from '@/components/AccessCodeInput'
import BackButton from '@/components/BackButton'
import MyButton from '@/components/Button'
import CreatePlayer from '@/components/CreatePlayer'
import MyText from '@/components/MyText'
import { useJoinLobby } from '@/hooks/useJoinLobby'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet } from 'react-native'

export default function JoinGame() {
  const { join } = useJoinLobby()
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string>('')
  const [accessCode, setAccessCode] = useState(['', '', '', ''])

  const handleJoinLobby = async () => {
    try {
      if (playerName.trim().length < 3 || image === null) {
        Alert.alert('Uzupełnij wszystkie pola')
        return
      }

      if (!image) {
        Alert.alert('Proszę przesłać zdjęcie przed rozpoczęciem gry')
        return
      }

      const result = await join(accessCode.join(''), playerName, image)

      if (!result.success) {
        Alert.alert(`Błąd: ${result.message}`)
      }
    } catch (err) {
      console.error('Błąd w trakcie dołączania do lobby: ', err)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.viewWrapper}>
      <BackButton />

      <MyText align="center">
        Wpisz kod dostępu, aby dołączyć do znajomych!
      </MyText>

      <AccessCodeInput
        accessCodeArray={accessCode}
        setAccessCode={setAccessCode}
      />

      <CreatePlayer
        playerName={playerName}
        image={image}
        setPlayerName={setPlayerName}
        setImage={setImage}
      />

      <MyButton onPress={handleJoinLobby} bgColor="purple">
        <MyText align="center">Dołącz</MyText>
      </MyButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 54,
    paddingHorizontal: 24,
  },
})
