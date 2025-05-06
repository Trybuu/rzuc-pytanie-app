import MyText from '@/components/MyText'
import { useState } from 'react'
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native'

export default function NewGame() {
  const [playerName, setPlayerName] = useState('Twoje imię')

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.viewContent}>
        <View style={styles.createPlayerView}>
          <MyText align="center">Kim jesteś? Pokaż się światu!</MyText>
          <Image
            style={{
              height: 192,
              width: 192,
              backgroundColor: 'orange',
              borderRadius: '50%',
              marginVertical: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* <MaterialIcons name="add-photo-alternate" size={64} color="#fff" /> */}
          </Image>
          <MyText align="center">
            {playerName.trim() === '' ? 'Twoje imię' : playerName}
          </MyText>
          <TextInput
            value={playerName}
            onChange={(e) => setPlayerName(e.nativeEvent.text)}
            style={{
              marginVertical: 24,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: '100%',
              color: '#A7A7A7',
              backgroundColor: '#282a3a',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 1, height: -3 },
              shadowOpacity: 0.25,
            }}
          ></TextInput>
        </View>

        <View>
          <Pressable style={styles.button}>
            <MyText align="center">Zaczynamy!</MyText>
          </Pressable>
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

  button: {
    marginVertical: 12,
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    textAlign: 'center',
    borderRadius: 24,
    // iOS shadow
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    // Android shadow
    elevation: 5,
  },
})
