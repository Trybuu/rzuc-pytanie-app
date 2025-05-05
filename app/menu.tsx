import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Menu() {
  return (
    <View>
      <Link href="/newGame">
        <Text>Rozpocznij grę</Text>
      </Link>
      <Link href="/joinGame">
        <Text>Dołącz do gry</Text>
      </Link>
      <Link href="/howToPlay">
        <Text>Jak grać</Text>
      </Link>
      <Link href="/questionCategories">
        <Text>Kategorie pytań</Text>
      </Link>
    </View>
  )
}
