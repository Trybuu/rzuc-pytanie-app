import ButtonLink from '@/components/ButtonLink'
import MyText from '@/components/MyText'
import { StyleSheet, View } from 'react-native'

export default function Menu() {
  return (
    <View style={styles.viewWrapper}>
      <ButtonLink href="/newGame">
        <MyText align="center">Rozpocznij grę</MyText>
      </ButtonLink>
      <ButtonLink href="/joinGame">
        <MyText align="center">Dołącz do gry</MyText>
      </ButtonLink>
      <ButtonLink href="/howToPlay">
        <MyText align="center">Jak grać</MyText>
      </ButtonLink>
      <ButtonLink href="/questionCategories">
        <MyText align="center">Kategorie pytań</MyText>
      </ButtonLink>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
})
