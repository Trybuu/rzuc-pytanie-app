import * as ImagePicker from 'expo-image-picker'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
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
  onImageUploadComplete?: (success: boolean) => void
}

const CreatePlayer: React.FC<CreatePlayerProps> = ({
  playerName,
  image,
  setPlayerName,
  setImage,
  onImageUploadComplete,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const inputRef = useRef<TextInput>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImageToServer = async (localUri: string) => {
    setIsUploading(true)
    const filename = localUri.split('/').pop()
    const match = /\.(\w+)$/.exec(filename || '')
    const type = match ? `image/${match[1]}` : `image`

    const formData = new FormData()
    formData.append('photo', {
      uri: localUri,
      name: filename,
      type,
    } as any)

    try {
      const res = await fetch(`${process.env.API_URL}/api/v1/photos/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-api-key': process.env.EXPO_PUBLIC_API_KEY || '',
        },
        body: formData,
      })

      const data = await res.json()
      setImage(
        `${process.env.API_URL}/api/v1/photos/${data.url.split('/').pop()}`,
      )
      onImageUploadComplete?.(true)
    } catch (err) {
      console.error('Błąd uploadu:', err)
      onImageUploadComplete?.(false)
    } finally {
      setIsUploading(false)
    }
  }

  const handleWebFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const uri = reader.result as string
        setImage(uri)
      }
      reader.readAsDataURL(file)
      onImageUploadComplete?.(true)
    }
  }

  const pickImage = async () => {
    Alert.alert(
      'Dodaj zdjęcie',
      'Wybierz źródło zdjęcia',
      [
        { text: 'Zrób zdjęcie', onPress: takePhoto },
        { text: 'Wybierz z galerii', onPress: pickFromGallery },
        { text: 'Anuluj', style: 'cancel' },
      ],
      { cancelable: true },
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
      quality: 0.5,
    })

    if (!result.canceled) {
      const localUri = result.assets[0].uri
      await uploadImageToServer(localUri)
    }
  }

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    })

    if (!result.canceled) {
      const localUri = result.assets[0].uri
      await uploadImageToServer(localUri)
    }
  }

  return (
    <View style={styles.createPlayerView}>
      <MyText align="center">Kim jesteś? Zaskocz znajomych!</MyText>

      <View style={styles.imagePickerWrapper}>
        <Pressable onPress={pickImage}>
          <View style={styles.glowWrapper}>
            {isUploading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Image
                source={
                  image !== ''
                    ? { uri: image }
                    : require('@/assets/images/graphics/add_photo_sphere.png')
                }
                style={styles.image}
              />
            )}
          </View>
        </Pressable>
      </View>

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
        ref={inputRef}
        value={playerName}
        placeholder="Twoje imię"
        placeholderTextColor="#FDD988"
        onChangeText={setPlayerName}
        style={styles.input}
        blurOnSubmit
        returnKeyType="done"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  createPlayerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePickerWrapper: {
    paddingVertical: 24,
  },

  image: {
    height: 260,
    width: 260,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#EDCC71',
    borderRadius: 130,
    marginVertical: 24,
    shadowColor: '#EDCC71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },

  glowWrapper: {
    height: 260,
    width: 260,
    borderRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDD988',
    shadowColor: '#FDD988',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 100,
    elevation: 100,
  },

  input: {
    width: '100%',
    marginVertical: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#FDD988',
    color: '#FDD988',
  },
})

export default CreatePlayer
