import BackgroundWrapper from '@/components/BackgroundWrapper'
import ButtonLink from '@/components/ButtonLink'
import MyText from '@/components/MyText'
import { useHeaderHeight } from '@react-navigation/elements'
import { StyleSheet, View } from 'react-native'

export default function Menu() {
  const headerHeight = useHeaderHeight()

  return (
    <BackgroundWrapper>
      <View style={[styles.viewWrapper, { paddingTop: headerHeight }]}>
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
    </BackgroundWrapper>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    padding: 24,
  },
})
