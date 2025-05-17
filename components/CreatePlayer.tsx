import * as ImagePicker from 'expo-image-picker'
import { useRef } from 'react'
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import MyText from './MyText'

type CreatePlayerProps = {
  playerName: string
  image: string
  setPlayerName: (name: string) => void
  setImage: (uri: string) => void
}

const CreatePlayer: React.FC<CreatePlayerProps> = ({
  playerName,
  image,
  setPlayerName,
  setImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleWebFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const uri = reader.result as string
        setImage(uri)
      }
      reader.readAsDataURL(file)
    }
  }

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
      base64: true,
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
      base64: true,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <View style={styles.createPlayerView}>
      <MyText align="center">Kim jesteś? Pokaż się światu!</MyText>
      <Pressable onPress={pickImage}>
        <Image
          source={
            image !== ''
              ? { uri: image }
              : require('@/assets/images/add-image.png')
          }
          style={styles.image}
        />
      </Pressable>

      {/* Web-only input */}
      {Platform.OS === 'web' && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleWebFileChange}
        />
      )}

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
  )
}

const styles = StyleSheet.create({
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

export default CreatePlayer
