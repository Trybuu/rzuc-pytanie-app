import AccessCodeInput from '@/components/AccessCodeInput'
import MyButton from '@/components/Button'
import CreatePlayer from '@/components/CreatePlayer'
import MyText from '@/components/MyText'
import { useJoinLobby } from '@/hooks/useJoinLobby'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

export default function JoinGame() {
  const { join } = useJoinLobby()
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string>('')
  const [accessCode, setAccessCode] = useState(['', '', '', ''])

  const handleJoinLobby = async () => {
    try {
      const result = await join(accessCode.join(''), playerName, image)

      if (!result?.success) {
        Alert.alert(`Błąd: ${result?.message}`)
      }
    } catch (err) {
      console.error('Błąd w trakcie dołączania do lobby: ', err)
    }
  }

  return (
    <ScrollView style={styles.viewWrapper}>
      <View style={styles.viewContent}>
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
      </View>

      <MyButton onPress={handleJoinLobby}>
        <MyText align="center">Dołącz</MyText>
      </MyButton>
    </ScrollView>
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
    justifyContent: 'center',
  },
})
