import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import { useRef, useState } from 'react'
import { Keyboard, StyleSheet, TextInput, View } from 'react-native'

export default function JoinGame() {
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

  return (
    <View style={styles.viewWrapper}>
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
      </View>

      <MyButton>
        <MyText align="center">Dołącz</MyText>
      </MyButton>
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
