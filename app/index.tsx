import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Index() {
  return (
    <View>
      <View>
        <Text>Rzuć pytanie</Text>
      </View>
      <View>
        <Text>
          Witaj w grze “Rzuć pytanie”, gdzie decyduje kostka, a reszta zależy od
          odwagi - zaproś znajomych i przygotujcie się na świetną zabawę!
        </Text>
      </View>
      <View>
        <Link href="/menu">
          <Text>Rozpocznij</Text>
        </Link>
      </View>
    </View>
  )
}
