import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

export default function NewGame() {
  const [playerName, setPlayerName] = useState('')
  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    Alert.alert(
      'Dodaj zdjęcie',
      'Wybierz źródło zdjęcia',
      [
        {
          text: 'Zrób zdjęcie',
          onPress: takePhoto,
        },
        {
          text: 'Wybierz z galerii',
          onPress: pickFromGallery,
        },
        {
          text: 'Anuluj',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      console.log('Brak uprawnień do użycia aparatu')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.viewContent}>
        <View style={styles.createPlayerView}>
          <MyText align="center">Kim jesteś? Pokaż się światu!</MyText>
          <Pressable onPress={pickImage}>
            <Image
              source={
                image
                  ? { uri: image }
                  : require('@/assets/images/add-image.png')
              }
              style={styles.image}
            />
          </Pressable>
          <MyText align="center">
            {playerName.trim() === '' ? 'Twoje imię' : playerName}
          </MyText>
          <TextInput
            value={playerName}
            placeholder="Twoje imię"
            onChange={(e) => setPlayerName(e.nativeEvent.text)}
            style={{
              marginVertical: 24,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: '100%',
              color: '#A7A7A7',
              backgroundColor: '#2b2d3f',
              borderRadius: 24,

              boxShadow: '0px 4px 1px #282a3a',
            }}
          ></TextInput>
        </View>

        <View>
          <MyButton>
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

  image: {
    height: 192,
    width: 192,
    borderRadius: 100,
    marginVertical: 24,
  },
})
