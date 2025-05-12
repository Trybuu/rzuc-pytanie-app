import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function Lobby() {
  const params = useLocalSearchParams()
  const { lobbyCode } = params
  return (
    <View>
      <Text>Lobby Screen {lobbyCode}</Text>
    </View>
  )
}
