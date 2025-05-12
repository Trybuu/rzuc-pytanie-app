import { socketCreateLobby } from '@/client/events'
import socket from '@/client/socket'
import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
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
  const router = useRouter()

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    return () => {
      socket.disconnect()
    }
  }, [])

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

  const handleCreateLobby = async () => {
    if (playerName.trim().length < 3 || image === null) {
      Alert.alert('Uzupełnij wszystkie pola')
      return
    }

    const lobbyCode = await socketCreateLobby(playerName, image)

    if (!lobbyCode) {
      Alert.alert('Nie udało się stworzyć lobby')
      return
    }
    console.log(lobbyCode)

    router.push({
      pathname: '/lobby',
      params: {
        lobbyCode,
      },
    })
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
            placeholderTextColor={'#fff'}
            onChange={(e) => setPlayerName(e.nativeEvent.text)}
            style={styles.input}
          ></TextInput>
        </View>

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

  image: {
    height: 192,
    width: 192,
    borderRadius: 100,
    marginVertical: 24,
  },

  input: {
    marginVertical: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: '100%',
    color: '#fff',
    fontFamily: 'MuseoModerno',
    backgroundColor: '#232638',
    borderRadius: 24,

    boxShadow: '-2px -2px 1px rgba(0,0,0,0.5)',
  },
})
