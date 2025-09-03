declare module 'expo-fast-image' {
  import { ImageProps, ImageStyle, StyleProp } from 'react-native'

  export interface FastImageProps extends ImageProps {
    source:
      | {
          uri?: string
          headers?: { [key: string]: string }
          priority?: 'low' | 'normal' | 'high'
          cache?: 'immutable' | 'web' | 'cacheOnly'
        }
      | number
    style?: StyleProp<ImageStyle>
    tintColor?: string
  }

  const FastImage: React.FC<FastImageProps>
  export default FastImage
}
