import ButtonLink from '@/components/ButtonLink'
import Logo from '@/components/Logo'
import MyText from '@/components/MyText'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function Menu() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo width={100} height={100} />
      </View>

      <ScrollView contentContainerStyle={styles.linksWrapper}>
        {/* <ImageLink
          href="/newGame"
          image={require('@/assets/images/graphics/new_game_button.png')}
          text="Nowa gra"
        />

        <ImageLink
          href="/joinGame"
          image={require('@/assets/images/graphics/new_game_button.png')}
          text="Dołącz do gry"
        />

        <ImageLink
          href="/howToPlay"
          image={require('@/assets/images/graphics/new_game_button.png')}
          text="Jak grać"
        />

        <ImageLink
          href="/questionCategories"
          image={require('@/assets/images/graphics/new_game_button.png')}
          text="Kategorie pytań"
        /> */}

        <ButtonLink href={'/newGame'}>
          <MyText align="center">Nowa Gra</MyText>
        </ButtonLink>
        <ButtonLink href={'/joinGame'}>
          <MyText align="center">Dołącz do gry</MyText>
        </ButtonLink>
        <ButtonLink href={'/howToPlay'}>
          <MyText align="center">Jak grać</MyText>
        </ButtonLink>
        <ButtonLink href={'/questionCategories'}>
          <MyText align="center">Kategorie pytań</MyText>
        </ButtonLink>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    flex: 1,
  },
  logoWrapper: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(160, 23, 244, 0.5)',
    marginHorizontal: 24,
  },
  linksWrapper: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
})
