import { useRef } from 'react'
import { Keyboard, StyleSheet, TextInput, View } from 'react-native'

type AccessCodeInputProps = {
  accessCodeArray: string[]
  setAccessCode: (newAccessCode: string[]) => void
}

const AccessCodeInput: React.FC<AccessCodeInputProps> = ({
  accessCodeArray,
  setAccessCode,
}) => {
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

    const newAccessCode = [...accessCodeArray]
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
      if (accessCodeArray[index] === '' && index > 0) {
        inputRefs[index - 1]?.current?.focus()
        const newAccessCode = [...accessCodeArray]
        newAccessCode[index - 1] = ''
        setAccessCode(newAccessCode)
      }
    }
  }
  return (
    <View style={styles.codeInputWrapper}>
      {accessCodeArray.map((digit, index) => {
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
  )
}

export default AccessCodeInput

const styles = StyleSheet.create({
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
