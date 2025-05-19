import MyButton from '@/components/Button'
import CreatePlayer from '@/components/CreatePlayer'
import MyText from '@/components/MyText'
import { useJoinLobby } from '@/hooks/useJoinLobby'
import { useRef, useState } from 'react'
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

export default function JoinGame() {
  const { join } = useJoinLobby()
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string>('')
  const [accessCode, setAccessCode] = useState(['', '', '', ''])
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ]

  const handleChange = (text: string, index: number) => {
    if (text.charCodeAt(0) < 48 || text.charCodeAt(0) > 57) {
      return
    }

    const newAccessCode = [...accessCode]
    newAccessCode[index] = text
    setAccessCode(newAccessCode)

    if (text && index < inputRefs.length - 1) {
      inputRefs[index + 1]?.current?.focus()
    } else if (index === inputRefs.length - 1 && text) {
      Keyboard.dismiss()
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (accessCode[index] === '' && index > 0) {
        inputRefs[index - 1]?.current?.focus()
        const newAccessCode = [...accessCode]
        newAccessCode[index - 1] = ''
        setAccessCode(newAccessCode)
      }
    }
  }

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

        <View style={styles.codeInputWrapper}>
          {accessCode.map((digit, index) => {
            return (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                onChange={(e) => handleChange(e.nativeEvent.text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                value={digit}
                maxLength={1}
                keyboardType="numeric"
                style={styles.codeInputTile}
              ></TextInput>
            )
          })}
        </View>

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

  codeInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },

  codeInputTile: {
    marginHorizontal: 6,
    boxShadow: '2px 4px 5px rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    height: 64,
    width: 64,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'MuseoModerno',
    fontSize: 24,
    borderWidth: 2,
    borderColor: 'rgb(255,157,0)',
  },
})
