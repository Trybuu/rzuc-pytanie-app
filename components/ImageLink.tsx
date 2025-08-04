import { ExternalPathString, RelativePathString, useRouter } from 'expo-router'
import React from 'react'
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import MyText from './MyText'

type ImageLinkProps = {
  href:
    | RelativePathString
    | ExternalPathString
    | '/newGame'
    | '/joinGame'
    | '/howToPlay'
    | '/questionCategories'
  image: ImageSourcePropType | undefined
  text?: string
  style?: ViewStyle
}

const ImageLink: React.FC<ImageLinkProps> = ({ href, image, text, style }) => {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => router.push(href)}
      style={[styles.wrapper, style]}
    >
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={styles.imageRounded}
        resizeMode="contain"
      >
        {text && <MyText align="center">{text}</MyText>}
      </ImageBackground>
    </Pressable>
  )
}

export default ImageLink

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    aspectRatio: 2.4,
    marginVertical: 8,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRounded: {
    borderRadius: 16,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
})
